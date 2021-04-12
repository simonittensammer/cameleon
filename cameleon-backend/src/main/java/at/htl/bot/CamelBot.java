package at.htl.bot;

import at.htl.control.CamRepository;
import at.htl.entity.Cam;
import org.telegram.telegrambots.bots.TelegramLongPollingBot;
import org.telegram.telegrambots.meta.api.methods.send.SendMessage;
import org.telegram.telegrambots.meta.api.methods.send.SendPhoto;
import org.telegram.telegrambots.meta.api.objects.InputFile;
import org.telegram.telegrambots.meta.api.objects.Update;
import org.telegram.telegrambots.meta.exceptions.TelegramApiException;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.List;

public class CamelBot extends TelegramLongPollingBot {

    CamRepository camRepository;

    private String chatId;

    public CamelBot(CamRepository camRepository) {
        this.camRepository = camRepository;
    }

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
        chatId = msg.getChatId();

        System.out.println(cmd);

        String[] commands = cmd.split(" ");

        switch (commands[0]) {
            case "/camlist":

                StringBuilder sb = new StringBuilder();
                List<Cam> camList = camRepository.listAll();

                if (camList.size() != 0) {
                    sb.append("Your Cams: ");
                    for (Cam cam1 : camList) {
                        sb.append("\n");
                        if (cam1.isMotionDetection()) sb.append("\uD83D\uDD34 ");
                        else sb.append("⚫ ");
                        sb.append(cam1.getId()).append(": ").append(cam1.getName());
                    }
                } else {
                    sb.append("No cams found");
                }

                msg.setText(sb.toString());

                break;
            case "/detail":
                Cam cam = camRepository.findById(Long.valueOf(commands[1]));
                if (cam != null) {
                    msg.setText("Id : " + cam.getId() +
                            "\nName: " + cam.getName() +
                            "\nDescription: " + cam.getDescription() +
                            "\nUrl: " + cam.getUrl());
                } else {
                    msg.setText("No cam found with id " + commands[1]);
                }

                break;
            case "/help":
                msg.setText("Commands: \n /help \n /camlist \n /detail <camid> (example: /detail 1)");
                break;
            default:
                msg.setText("Commands: \n /help \n /camlist \n /detail <camid> (example: /detail 1)");
                break;

        }

        try {
            execute(msg);
        } catch (TelegramApiException e) {
            e.printStackTrace();
        }
    }

    public void sendMessage(String message, BufferedImage image) {
        if (chatId == null) return;

        ByteArrayOutputStream os = new ByteArrayOutputStream();

        try {
            ImageIO.write(image, "jpg", os);
        } catch (IOException e) {
            e.printStackTrace();
        }

        InputStream is = new ByteArrayInputStream(os.toByteArray());

        SendPhoto photo = new SendPhoto();
        photo.setPhoto(new InputFile(is, "md.jpg"));
        photo.setCaption(message);
        photo.setChatId(chatId);

        try {
            execute(photo);
        } catch (TelegramApiException e) {
            e.printStackTrace();
        }
    }
}
