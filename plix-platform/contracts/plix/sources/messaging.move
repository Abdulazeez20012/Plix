module plix::messaging {
    use std::string::String;
    use sui::object::{UID, ID};
    use sui::transfer;
    use sui::tx_context::TxContext;
    use sui::vec_set::{Self, VecSet};

    public struct Message has key {
        id: UID,
        sender: address,
        recipient: address,
        content: String,
        timestamp: u64,
        is_read: bool,
    }

    public struct Conversation has key {
        id: UID,
        participants: VecSet<address>,
        messages: vector<ID>, // References to Message objects using ID instead of UID
        created_at: u64,
    }

    // Send a new message
    public entry fun send_message(
        recipient: address,
        content: String,
        ctx: &mut TxContext
    ) {
        let sender = tx_context::sender(ctx);
        
        // Create the message
        let message = Message {
            id: object::new(ctx),
            sender,
            recipient,
            content,
            timestamp: ctx.epoch(),
            is_read: false,
        };
        
        transfer::transfer(message, recipient);
    }

    // Create a conversation between participants
    public entry fun create_conversation(
        participants: vector<address>,
        ctx: &mut TxContext
    ) {
        let mut mut_participants = vec_set::empty();
        let mut i = 0;
        let len = vector::length(&participants);
        
        while (i < len) {
            let participant = *vector::borrow(&participants, i);
            mut_participants.insert(participant);
            i = i + 1;
        };
        
        let conversation = Conversation {
            id: object::new(ctx),
            participants: mut_participants,
            messages: vector::empty(),
            created_at: ctx.epoch(),
        };
        
        // Transfer the conversation to the first participant
        let first_participant = *vector::borrow(&participants, 0);
        transfer::transfer(conversation, first_participant);
    }

    // Add a message to a conversation
    public entry fun add_message_to_conversation(
        conversation: &mut Conversation,
        message: &Message,
    ) {
        // Convert UID to ID which has copy ability
        let message_id = object::id(message);
        conversation.messages.push_back(message_id);
    }

    // Mark a message as read
    public entry fun mark_as_read(message: &mut Message) {
        message.is_read = true;
    }

    // Getters
    public fun get_sender(message: &Message): address {
        message.sender
    }

    public fun get_recipient(message: &Message): address {
        message.recipient
    }

    public fun get_content(message: &Message): &String {
        &message.content
    }

    public fun is_message_read(message: &Message): bool {
        message.is_read
    }
}