export default {
  webpack(config, env, helpers, options) {
    const publicPath = process.env.GITHUB_PAGES
      ? `/${process.env.GITHUB_PAGES}/`
      : "/";
    config.output.publicPath = publicPath;

    const ghEnv =
      process.env.GITHUB_PAGES && JSON.stringify(`${process.env.GITHUB_PAGES}`);
    const { plugin } = helpers.getPluginsByName(config, "DefinePlugin")[0];
    Object.assign(plugin.definitions, { "process.env.GITHUB_PAGES": ghEnv });

    if (!config.resolve) config.resolve = {};
    if (!config.resolve.alias) config.resolve.alias = {};
    const prevAliases = config.resolve.alias;
    const reactAliases = {
      react: "preact/compat",
      "react-dom/test-utils": "preact/test-utils",
      "react-dom": "preact/compat", // Must be below test-utils
      "react/jsx-runtime": "preact/jsx-runtime"
    };
    config.resolve.alias = {
      ...prevAliases,
      ...reactAliases
    };
  }
};
