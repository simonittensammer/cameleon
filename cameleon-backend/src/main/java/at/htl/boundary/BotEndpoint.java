package at.htl.boundary;

import at.htl.bot.CamelBot;
import org.telegram.telegrambots.meta.TelegramBotsApi;
import org.telegram.telegrambots.meta.exceptions.TelegramApiException;
import org.telegram.telegrambots.updatesreceivers.DefaultBotSession;

import javax.ws.rs.GET;
import javax.ws.rs.Path;

@Path("/bot")
public class BotEndpoint {

    @GET
    public String startBot() {
        try {
            TelegramBotsApi botsApi = new TelegramBotsApi(DefaultBotSession.class);
            botsApi.registerBot(new CamelBot());
            return "success";
        } catch (TelegramApiException e) {
            e.printStackTrace();
            return "exception";
        }
    }
}
