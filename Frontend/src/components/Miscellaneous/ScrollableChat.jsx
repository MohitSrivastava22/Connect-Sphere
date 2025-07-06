import { Avatar, Tooltip } from '@chakra-ui/react';
import React from 'react';
import ScrollableFeed from 'react-scrollable-feed';
import { isDifferentSender, isLastMessage, isSameSenderMargin, isSameUser } from '../../config/getSender';
import { ChatState } from '../../Context/ChatProvider';

function ScrollableChat({ message }) {
  if (!message || message.length === 0) {
    return <div>No messages yet!</div>;
  }

  const { user } = ChatState();

  return (
    <ScrollableFeed forceScroll={true}>
      {Array.isArray(message) &&
        message.map((m, i) => (
          <div style={{ display: 'flex' }} key={`${m._id}-${i}`}>
            {(isDifferentSender(message, m, i, user?.id) || isLastMessage(message, i, user?.id)) && (
              <Tooltip label={m.sender.name} placement="bottom-start" hasArrow>
                <Avatar
                  mt="7px"
                  mr={1}
                  size="sm"
                  cursor="pointer"
                  name={m.sender.name}
                  src={m.sender.pic}
                />
              </Tooltip>
            )}

            <span
              style={{
                backgroundColor: m.sender._id?.toString() === user.id?.toString() ? '#BEE3F8' : '#B9F5D0',
                marginLeft: isSameSenderMargin(message, m, i, user.id),
                marginTop: isSameUser(message, m, i) ? 3 : 10,
                borderRadius: '20px',
                padding: '5px 15px',
                maxWidth: '75%',
              }}
            >
              {m.content}
            </span>
          </div>
        ))}
    </ScrollableFeed>
  );
}

export default ScrollableChat;
