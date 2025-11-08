
/*
import { app } from "../../app";

app.view("incidente_modal", async ({ ack, body, view, client }) => {
  await ack(); 

  const user = body.user?.id;
  if (!user) return;

  const servico = view.state.values.servico.servico_input.selected_option?.text.text ?? "não selecionado";
  const assunto = view.state.values.assunto.assunto_input.value ?? "sem assunto";
  const descricao = view.state.values.descricao.descricao_input.value ?? "sem descrição";

  await client.chat.postMessage({
    channel: user,
    text: `Incidente criado com sucesso!\n*Serviço:* ${servico}\n*Assunto:* ${assunto}\n*Descrição:* ${descricao}`,
  });
});
*/