module plix::messaging_tests {
    use std::string::String;
    use sui::test_scenario;
    use plix::messaging::{Self, Message, Conversation};

    #[test]
    public fun test_send_message() {
        let scenario = test_scenario::begin(0x1);
        {
            let scenario_val = &mut scenario;
            
            // Send a message from address 0x1 to 0x2
            test_scenario::next_tx(scenario_val, 0x1);
            messaging::send_message(
                @0x2,
                string::utf8(b"Hello, this is a test message!"),
                test_scenario::ctx(scenario_val)
            );

            // Get the message as recipient (0x2)
            test_scenario::next_tx(scenario_val, 0x2);
            let message = test_scenario::take_shared_object<Message>(scenario_val);
            
            // Verify message properties
            assert!(messaging::get_sender(&message) == @0x1, 0);
            assert!(messaging::get_recipient(&message) == @0x2, 0);
            assert!(string::bytes_equal(messaging::get_content(&message), b"Hello, this is a test message!"), 0);
            assert!(messaging::is_message_read(&message) == false, 0);
            
            // Mark message as read
            messaging::mark_as_read(&mut message);
            assert!(messaging::is_message_read(&message) == true, 0);
            
            // Return the message to the scenario
            test_scenario::return_shared_object(scenario_val, message);
        };
        test_scenario::end(scenario);
    }

    #[test]
    public fun test_create_conversation() {
        let scenario = test_scenario::begin(0x1);
        {
            let scenario_val = &mut scenario;
            
            // Create a conversation with two participants
            test_scenario::next_tx(scenario_val, 0x1);
            let mut participants = vector::empty<address>();
            vector::push_back(&mut participants, @0x1);
            vector::push_back(&mut participants, @0x2);
            
            messaging::create_conversation(
                participants,
                test_scenario::ctx(scenario_val)
            );

            // Get the conversation
            let conversation = test_scenario::take_shared_object<Conversation>(scenario_val);
            
            // Verify conversation was created
            assert!(vector::length(&conversation.messages) == 0, 0);
            
            // Return the conversation to the scenario
            test_scenario::return_shared_object(scenario_val, conversation);
        };
        test_scenario::end(scenario);
    }
}