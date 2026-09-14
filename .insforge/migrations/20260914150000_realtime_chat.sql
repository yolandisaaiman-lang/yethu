-- Durable direct-message delivery and InsForge Realtime fan-out.
-- Apply this migration through the linked InsForge project before deploying the client update.

CREATE INDEX IF NOT EXISTS chat_messages_conversation_created_at_idx
  ON public.chat_messages (conversation_id, created_at);

INSERT INTO realtime.channels (pattern, description, enabled)
VALUES ('chat:%', 'Private direct-message events', true),
       ('inbox:%', 'Private direct-message inbox events', true)
ON CONFLICT (pattern) DO UPDATE
SET description = EXCLUDED.description, enabled = EXCLUDED.enabled;

ALTER TABLE realtime.channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE realtime.messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS yeth_users_subscribe_direct_messages ON realtime.channels;
CREATE POLICY yeth_users_subscribe_direct_messages
ON realtime.channels FOR SELECT TO authenticated
USING (
  (pattern = 'chat:%' AND realtime.channel_name() LIKE 'chat:dm_%'
    AND position((SELECT auth.uid())::text IN substring(realtime.channel_name() FROM 6)) > 0)
  OR (pattern = 'inbox:%' AND realtime.channel_name() = 'inbox:' || (SELECT auth.uid())::text)
);

DROP POLICY IF EXISTS yeth_members_publish_direct_messages ON realtime.messages;
CREATE POLICY yeth_members_publish_direct_messages
ON realtime.messages FOR INSERT TO authenticated
WITH CHECK (
  channel_name LIKE 'chat:dm_%'
  AND position((SELECT auth.uid())::text IN substring(channel_name FROM 6)) > 0
);

CREATE OR REPLACE FUNCTION public.publish_chat_message()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, pg_temp
AS $$
BEGIN
  PERFORM realtime.publish(
    'chat:' || NEW.conversation_id,
    'new_message',
    jsonb_build_object(
      'conversationId', NEW.conversation_id,
      'message', jsonb_build_object(
        'id', NEW.id,
        'senderId', NEW.sender_id,
        'senderName', NEW.sender_name,
        'senderHandle', NEW.sender_handle,
        'senderAvatar', NEW.sender_avatar,
        'countryFlag', NEW.country_flag,
        'sourceLanguage', NEW.source_language,
        'originalText', NEW.original_text,
        'translatedText', NEW.translated_text,
        'targetLanguage', NEW.target_language,
        'timestamp', to_char(NEW.created_at AT TIME ZONE 'UTC', 'HH24:MI'),
        'isEncrypted', NEW.is_encrypted,
        'encryptedPayload', NEW.encrypted_payload,
        'expiresIn', NEW.expires_in
      )
    )
  );
  -- DM IDs are dm_<uuid>_<uuid>; fan out to both authenticated inboxes so a
  -- recipient sees a new conversation even before selecting it in the UI.
  PERFORM realtime.publish('inbox:' || (regexp_match(NEW.conversation_id, '([0-9a-f-]{36})'))[1], 'new_message', jsonb_build_object('conversationId', NEW.conversation_id, 'message', jsonb_build_object('id', NEW.id, 'senderId', NEW.sender_id, 'senderName', NEW.sender_name, 'senderHandle', NEW.sender_handle, 'senderAvatar', NEW.sender_avatar, 'countryFlag', NEW.country_flag, 'sourceLanguage', NEW.source_language, 'originalText', NEW.original_text, 'translatedText', NEW.translated_text, 'targetLanguage', NEW.target_language, 'timestamp', to_char(NEW.created_at AT TIME ZONE 'UTC', 'HH24:MI'), 'isEncrypted', NEW.is_encrypted, 'encryptedPayload', NEW.encrypted_payload, 'expiresIn', NEW.expires_in)));
  PERFORM realtime.publish('inbox:' || (regexp_match(NEW.conversation_id, '([0-9a-f-]{36}).*?([0-9a-f-]{36})'))[2], 'new_message', jsonb_build_object('conversationId', NEW.conversation_id, 'message', jsonb_build_object('id', NEW.id, 'senderId', NEW.sender_id, 'senderName', NEW.sender_name, 'senderHandle', NEW.sender_handle, 'senderAvatar', NEW.sender_avatar, 'countryFlag', NEW.country_flag, 'sourceLanguage', NEW.source_language, 'originalText', NEW.original_text, 'translatedText', NEW.translated_text, 'targetLanguage', NEW.target_language, 'timestamp', to_char(NEW.created_at AT TIME ZONE 'UTC', 'HH24:MI'), 'isEncrypted', NEW.is_encrypted, 'encryptedPayload', NEW.encrypted_payload, 'expiresIn', NEW.expires_in)));
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS chat_messages_realtime_insert ON public.chat_messages;
CREATE TRIGGER chat_messages_realtime_insert
AFTER INSERT ON public.chat_messages
FOR EACH ROW EXECUTE FUNCTION public.publish_chat_message();
