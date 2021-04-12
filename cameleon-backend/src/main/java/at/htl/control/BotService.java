package at.htl.control;

import at.htl.bot.CamelBot;
import io.quarkus.runtime.StartupEvent;
import org.telegram.telegrambots.meta.TelegramBotsApi;
import org.telegram.telegrambots.meta.exceptions.TelegramApiException;
import org.telegram.telegrambots.updatesreceivers.DefaultBotSession;

import javax.annotation.PostConstruct;
import javax.enterprise.context.ApplicationScoped;
import javax.enterprise.event.Observes;
import javax.inject.Inject;
import javax.inject.Singleton;

@Singleton
public class BotService {

    @Inject
    CamRepository camRepository;

    public CamelBot camelBot;

    public void init(@Observes StartupEvent event) {
        camelBot = new CamelBot(camRepository);

        try {
            TelegramBotsApi botsApi = new TelegramBotsApi(DefaultBotSession.class);
            botsApi.registerBot(camelBot);
        } catch (TelegramApiException e) {
            e.printStackTrace();
        }
    }
}
