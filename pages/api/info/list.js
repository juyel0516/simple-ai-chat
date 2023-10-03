export default async function (req, res) {
  try {
    // configurations
    const role_content_system = process.env.ROLE_CONTENT_SYSTEM ? process.env.ROLE_CONTENT_SYSTEM : "";
    const temperature = process.env.TEMPERATURE ? Number(process.env.TEMPERATURE) : 0.7;  // default is 0.7
    const top_p = process.env.TOP_P ? Number(process.env.TOP_P) : 1;                      // default is 1
    const fine_tune_stop = process.env.FINE_TUNE_STOP ? process.env.FINE_TUNE_STOP : "";
    const fine_tune_prompt_end = process.env.FINE_TUNE_PROMPT_END ? process.env.FINE_TUNE_PROMPT_END : "";
    const prompt_prefix = process.env.PROMPT_PREFIX ? process.env.PROMPT_PREFIX : "";
    const prompt_suffix = process.env.PROMPT_SUFFIX ? process.env.PROMPT_SUFFIX : "";
    const init_placeholder = process.env.INIT_PLACEHOLDER ? process.env.INIT_PLACEHOLDER : "";
    const waiting = process.env.WAITING ? process.env.WAITING : "...";
    const querying = process.env.QUERYING ? process.env.QUERYING : "...";
    const enter = process.env.ENTER ? process.env.ENTER : "";
    const max_tokens = process.env.MAX_TOKENS ? Number(process.env.MAX_TOKENS) : 500;
    const stream_console = process.env.STREAM_CONSOLE == "true" ? true : false;
    const use_eval = process.env.USE_EVAL == "true" ? true : false;
    const use_function_calling = process.env.USE_FUNCTION_CALLING == "true" ? true : false;
    const use_node_ai = process.env.USE_NODE_AI == "true" ? true : false;
    const force_node_ai_query = process.env.FORCE_NODE_AI_QUERY == "true" ? true : false;
    const use_vector = process.env.USE_VECTOR == "true" ? true : false;
    const force_vector_query = process.env.FORCE_VECTOR_QUERY == "true" ? true : false;

    // Output the result
    res.status(200).json({
      result: {
        role_content_system: role_content_system,
        temperature: temperature,
        top_p: top_p,
        fine_tune_stop: fine_tune_stop,
        fine_tune_prompt_end: fine_tune_prompt_end,
        prompt_prefix: prompt_prefix,
        prompt_suffix: prompt_suffix,
        init_placeholder: init_placeholder,
        waiting: waiting,
        querying: querying,
        enter: enter,
        max_tokens: max_tokens,
        stream_console: stream_console,
        use_eval: use_eval,
        use_function_calling: use_function_calling,
        use_node_ai: use_node_ai,
        force_node_ai_query: force_node_ai_query,
        use_vector: use_vector,
        force_vector_query: force_vector_query,
        use_vector: use_vector,
        force_vector_query: force_vector_query,
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