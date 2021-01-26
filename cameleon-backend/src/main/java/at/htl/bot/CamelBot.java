package at.htl.bot;

import at.htl.control.CamRepository;
import at.htl.entity.Cam;
import org.telegram.telegrambots.bots.TelegramLongPollingBot;
import org.telegram.telegrambots.meta.api.methods.send.SendMessage;
import org.telegram.telegrambots.meta.api.objects.Update;
import org.telegram.telegrambots.meta.exceptions.TelegramApiException;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;

@ApplicationScoped
public class CamelBot extends TelegramLongPollingBot {

    @Inject
    CamRepository camRepository;

    @Override
    public String getBotUsername() {
        return "CameleonBot";
    }

    @Override
    public String getBotToken() {
        return "1151670452:AAFFOIPbYPlIXB_lJp5IfoC77DXAUknabZg";
    }

    @Override
    public void onUpdateReceived(Update update) {

        String cmd = update.getMessage().getText();
        SendMessage msg = new SendMessage();
        msg.setChatId(String.valueOf(update.getMessage().getChatId()));

        System.out.println(cmd);

        switch (cmd) {
            case "/camlist":
                msg.setText("Command " + cmd + " was called!");

                break;
            case "/currentcam":
                Cam cam = new Cam("CurrentName", "CurrentDesc", "CurrentUrl");

                msg.setText("Id: " + cam.getId() + "\n" +
                        "Name: " + cam.getName() + "\n" +
                        "Description: " + cam.getDescription() + "\n" +
                        "URL: " + cam.getUrl());

                break;
            default:
                msg.setText("Unrecognized command. Say what?");
                break;
        }

        try {
            execute(msg);
        } catch (TelegramApiException e) {
            e.printStackTrace();
        }
    }
}
