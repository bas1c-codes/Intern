package com.devflow.intern.webhook;

import com.devflow.intern.model.ProviderModel;
import com.devflow.intern.model.WebhookEvent;
import com.devflow.intern.repository.LeadRepository;
import com.devflow.intern.repository.ProviderRepository;
import com.devflow.intern.repository.WebhookEventRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/webhook/reset-quota")
public class ResetQuota {

    private final ProviderRepository providerRepository;
    private final LeadRepository leadRepository;
    private final WebhookEventRepository webhookEventRepository;

    public ResetQuota(
            ProviderRepository providerRepository,
            LeadRepository leadRepository,
            WebhookEventRepository webhookEventRepository
    ) {
        this.providerRepository = providerRepository;
        this.leadRepository = leadRepository;
        this.webhookEventRepository = webhookEventRepository;
    }

    @PostMapping
    ResponseEntity<?> reset(@RequestParam String eventId) {

        if (webhookEventRepository.existsById(eventId)) {
            return ResponseEntity.ok(
                    Map.of("message", "Already processed")
            );
        }

        List<ProviderModel> providers =
                providerRepository.findAll();

        for (ProviderModel p : providers) {
            p.setQuota(0);
        }

        providerRepository.saveAll(providers);

        webhookEventRepository.save(
                new WebhookEvent(eventId)
        );

        return ResponseEntity.ok(
                Map.of("message", "Quota reset success")
        );
    }
}