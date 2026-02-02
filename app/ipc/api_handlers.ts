import { ipcMain } from "electron";
import fs from "fs";
import path from "path";

export function setupApiHandlers() {
  // Handler for can-change-keys API
  ipcMain.handle("api:can-change-keys", async () => {
    const canChangeKeys = process.env.CAN_CHANGE_KEYS !== "false";
    return { canChange: canChangeKeys };
  });

  // Handler for has-required-key API
  ipcMain.handle("api:has-required-key", async () => {
    const userConfigPath = process.env.USER_CONFIG_PATH;

    let keyFromFile = "";
    if (userConfigPath && fs.existsSync(userConfigPath)) {
      try {
        const raw = fs.readFileSync(userConfigPath, "utf-8");
        const cfg = JSON.parse(raw || "{}");
        keyFromFile = cfg?.OPENAI_API_KEY || "";
      } catch {
        // Silent error handling
      }
    }

    const keyFromEnv = process.env.OPENAI_API_KEY || "";
    const hasKey = Boolean((keyFromFile || keyFromEnv).trim());
    
    return { hasKey };
  });

  // Handler for telemetry-status API
  ipcMain.handle("api:telemetry-status", async () => {
    const isDisabled = process.env.DISABLE_ANONYMOUS_TELEMETRY === 'true' || process.env.DISABLE_ANONYMOUS_TELEMETRY === 'True';
    const telemetryEnabled = !isDisabled;
    return { telemetryEnabled };
  });

  // Handler for save-layout API
  ipcMain.handle("api:save-layout", async (event, { layout_name, components }) => {
    try {
      if (!layout_name || !components || !Array.isArray(components)) {
        throw new Error("Invalid request body. Expected layout_name and components array.");
      }

      // Define the layouts directory path
      const layoutsDir = path.join(process.cwd(), "app_data", "layouts", layout_name);

      // Create the directory if it doesn't exist
      if (!fs.existsSync(layoutsDir)) {
        fs.mkdirSync(layoutsDir, { recursive: true });
      }

      // Save each component as a separate file
      const savedFiles = [];

      for (const component of components) {
        const { slide_number, component_code, component_name } = component;

        if (!component_code || !component_name) {
          console.warn(
            `Skipping component for slide ${slide_number}: missing code or name`
          );
          continue;
        }

        const fileName = `${component_name}.tsx`;
        const filePath = path.join(layoutsDir, fileName);
        const cleanComponentCode = component_code
          .replace(/```tsx/g, "")
          .replace(/```/g, "");

        fs.writeFileSync(filePath, cleanComponentCode, "utf8");
        savedFiles.push({
          slide_number,
          component_name,
          file_path: filePath,
          file_name: fileName,
        });
      }

      return {
        success: true,
        layout_name,
        path: layoutsDir,
        saved_files: savedFiles.length,
        components: savedFiles,
      };
    } catch (error) {
      console.error("Error saving layout:", error);
      throw new Error("Failed to save layout components");
    }
  });

  // Handler for templates API (static list)
  ipcMain.handle("api:templates", async () => {
    // This would return the static templates data
    // The actual implementation would depend on how templates are stored
    try {
      const templatesPath = path.join(process.cwd(), "servers", "nextjs", "presentation-templates");
      if (fs.existsSync(templatesPath)) {
        const templateDirs = fs.readdirSync(templatesPath, { withFileTypes: true })
          .filter(dirent => dirent.isDirectory())
          .map(dirent => dirent.name);
        
        return templateDirs;
      }
      return [];
    } catch (error) {
      console.error("Error reading templates:", error);
      return [];
    }
  });
}