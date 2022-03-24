export interface QueueConsumer {
    bind(): Promise<void>;
}
