import { app } from "../../app";
import dotenv from "dotenv"

dotenv.config()

app.event("app_home_opened", async ({ event, client }) => {
   try {
  await client.views.publish({
  user_id: event.user,
  view: {
    type: "home",
    blocks: [
      
      {
        type: "image",
        image_url: "", 
        alt_text: "Banner principal",
      },
      
      {
        type: "header",
        text: {
          type: "plain_text",
          text:  `:tuna-bot: `, //
          emoji: true,
        },
      },
      
      {
        type: "divider",
      },
    ],
  },
});
  } catch (err) {
    console.error("Erro ao atualizar Home Tab:", err);
  }
});



