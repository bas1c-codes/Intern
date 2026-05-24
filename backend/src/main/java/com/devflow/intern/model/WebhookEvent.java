package com.devflow.intern.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity
public class WebhookEvent {

    @Id
    private String eventId;

    public WebhookEvent() {
    }

    public WebhookEvent(String eventId) {
        this.eventId = eventId;
    }

    public String getEventId() {
        return eventId;
    }

    public void setEventId(String eventId) {
        this.eventId = eventId;
    }
}
