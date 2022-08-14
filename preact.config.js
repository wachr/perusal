export default {
  webpack(config, env, helpers) {
    const publicPath = process.env.GITHUB_PAGES
      ? `/${process.env.GITHUB_PAGES}/`
      : "/";
    config.output.publicPath = publicPath;

    const ghEnv =
      process.env.GITHUB_PAGES && JSON.stringify(`${process.env.GITHUB_PAGES}`);
    const { plugin } = helpers.getPluginsByName(config, "DefinePlugin")[0];
    Object.assign(plugin.definitions, { "process.env.GITHUB_PAGES": ghEnv });

    // Conditionally use polling to work around filesystem limitations
    // https://webpack.js.org/configuration/watch/#watchoptionspoll
    if (process.env.USE_NFS_POLLING) config.devServer.watchOptions.poll = 1500;

    if (!config.resolve) config.resolve = {};
    if (!config.resolve.alias) config.resolve.alias = {};
    const prevAliases = config.resolve.alias;
    const reactAliases = {
      react: "preact/compat",
      "react-dom/test-utils": "preact/test-utils",
      "react-dom": "preact/compat", // Must be below test-utils
      "react/jsx-runtime": "preact/jsx-runtime",
    };
    config.resolve.alias = {
      ...prevAliases,
      ...reactAliases,
    };
  },
};
