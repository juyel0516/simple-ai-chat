import { getSystemConfigurations } from "utils/sysUtils";

export default async function (req, res) {
  try {
    // configurations
    const { model, model_v, role_content_system, welcome_message, querying, waiting, init_placeholder, enter, temperature, top_p, max_tokens, use_function_calling, use_node_ai, use_vector, use_payment, use_access_control, use_email } = getSystemConfigurations();

    res.status(200).json({
      result: {
        role_content_system: role_content_system,
        welcome_message: welcome_message,
        querying: querying,
        waiting: waiting,
        init_placeholder: init_placeholder,
        enter: enter,
        temperature: temperature,
        top_p: top_p,
        max_tokens: max_tokens,
        use_function_calling: use_function_calling,
        use_node_ai: use_node_ai,
        use_vector: use_vector,
        use_payment: use_payment,
        use_email: use_email,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: {
        message: "An error occurred during your request.",
      },
    });
  }
}
