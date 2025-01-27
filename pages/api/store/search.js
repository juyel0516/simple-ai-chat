import { vectaraQuery } from "utils/vectaraUtils";
import { getStore } from "utils/sqliteUtils";
import { authenticate } from "utils/authUtils";
import { mysqlQuery } from "utils/mysqlUtils";

export default async function handler(req, res) {
  const { store, text } = req.body;

  // Authentication
  const authResult = authenticate(req);
  if (!authResult.success) {
    return res.status(401).json({
      success: false,
      error: authResult.error
    });
  }
  const { id, username } = authResult.user;

  try {
    const store_ = await getStore(store, username);
    if (!store_) {
      res.status(404).json({
        success: false,
        error: "Store not found.",
      });
      return;
    }
    
    // Get settings
    const settings = JSON.parse(store_.settings);

    // Check is initialized
    if (!settings.engine) {
      res.status(400).json({
        success: false,
        error: "Store not initialized. Use `:store init [engine]` to initialize a data store.",
      });
      return;
    }

    if (settings.engine === "vectara") {
      const queryResult = await searchVectaraStore(settings, text);
      if (!queryResult.success) {
        res.status(400).json({
          success: false,
          error: queryResult.error,
        });
        return;
      }
      res.status(200).json({
        success: true,
        message: queryResult.message,
      });
      return;
    }

    if (settings.engine === "mysql") {
      const queryResult = await searchMysqlStore(settings, text);
      if (!queryResult.success) {
        res.status(400).json({
          success: false,
          error: queryResult.error,
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: queryResult.message,
      });
      return;
    }

    res.status(400).json({
      success: false,
      error: "Invalid engine for search.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: "An error occurred during your request.",
    });
  }
}

async function searchMysqlStore(settings, text) {
  const host = settings.host;
  const port = settings.port;
  const user = settings.user;
  const password = settings.password;
  const database = settings.database;
  if (!host || !port || !user || !password || !database) {
    return {
      success: false,
      error: "Store not configured. Use `:store set [key] [value]` to configure the store settings.",
    };
  }

  const dbConfig = {
    host,
    port,
    user,
    password,
    database,
  }

  // Query
  // TODO use generate instead
  const queryResult = await mysqlQuery(dbConfig, text);
  return {
    success: true,
    message: JSON.stringify(queryResult, null, 2),
  };
}

async function searchVectaraStore(settings, text) {
  const corpusId = settings.corpusId;
  const apiKey = settings.apiKey;
  const threshold = settings.threshold;
  const numberOfResults = settings.numberOfResults;
  if (!apiKey || !corpusId || !threshold || !numberOfResults) {
    return {
      success: false,
      error: "Store not configured. Use `:store set [key] [value]` to configure the store settings.",
    };
  }

  // Query
  const queryResult = await vectaraQuery(text, corpusId, apiKey, threshold, numberOfResults);
  if (queryResult && queryResult.length > 0) {
    let result = "";
    for (let i = 0; i < queryResult.length; i++) {
      result += "Document: " + queryResult[i].document + "\n" +
                (queryResult[i].title && "Title: " + queryResult[i].title) + "\n" +
                "Score: " + queryResult[i].score + "\n" +
                "Content:\n" + queryResult[i].content + "\n\n";
    }
    return {
      success: true,
      message: result,
    };
  } else {
    return {
      success: true,
      message: "No results found.",
    };
  }
}
