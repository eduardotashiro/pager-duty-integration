/*
export interface AppHomeOpenedEvent {
    type: 'app_home_opened';
    user: string;
    channel: string;
    tab?: 'home' | 'messages';
    view?: View;
    event_ts: string;
}
    */

app.event("app_home_opened", async ({ event, client }) => {
   try {
  await client.views.publish({
  user_id: event.user,
  view: {
    type: "home",
    blocks: [
      
      {
        type: "image",
        image_url: "https://", 
        alt_text: "Banner principal",
      },
      
      {
        type: "header",
        text: {
          type: "plain_text",
          text:  `UM DIA SAI`, 
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

