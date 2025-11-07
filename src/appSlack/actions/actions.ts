// btn pro modal, 
app.action("cria_incidente_btn", async ({ ack, body, client }) => {//que tipo é isso ??
  await ack();

  
  const triggerId = (body as any).trigger_id;

  if (!triggerId) return

  await client.views.open({
    trigger_id: triggerId,
    view: createModal(),
  });
});
