import * as React from 'react';

enum ChatMessageStatus {
    Sent = 'sent',
    Sending = 'sending',
    Received = 'received',
    Rejected = 'rejected',
    Aborted = 'aborted',
}

const BubbleBase = () => null;

const BubbleSent = () => null;

const BubbleSending = () => null;

const BubbleReceived = () => null;

const BubbleRejected = () => null;

const BubbleAborted = () => null;

const Bubble = ({ status }: { status: ChatMessageStatus }) => {
    switch (status) {
        case ChatMessageStatus.sent: return <BubbleSent />;
        case ChatMessageStatus.sending: return <BubbleSending />;
        case ChatMessageStatus.received: return <BubbleReceived />;
        case ChatMessageStatus.rejected: return <BubbleRejected />;
        case ChatMessageStatus.aborted: return <BubbleAborted />;
        default: return null;
    }
}