# Shopify Project

This README provides an overview of the setup and usage for a Shopify project that utilizes Gulp for asset management.

## Project Structure

The project has the following structure:
```
shopify-project/
│
├── dev/
│   ├── scss/
│   ├── js/
│   ├── images/
│   ├── gulpfile.js
│   └── package.json
│
├── assets/
│
└── README.md
```

- `dev/` - This directory contains all the source assets for the project.
  - `scss/` - Directory for SCSS files.
  - `js/` - Directory for JavaScript files.
  - `images/` - Directory for image files.
  - `gulpfile.js` - Configuration file for Gulp tasks.
  - `package.json` - Lists the project dependencies and scripts.

- `assets/` - This directory will contain the minified and processed assets ready for use in Shopify.

## Setup and Installation

Before running the project, ensure you have Node.js installed on your machine. Then follow these steps:

1. **Navigate to the project directory**:
    ```bash
    cd shopify-project
    ```

2. **Install the project dependencies**:
    ```bash
    npm install
    ```

3. **Recommended versions for Node & NPM are**:
    ```bash
    Node v14.21.3
    npm v6.14.18
    ```
## Usage

To start the Gulp process and minify all assets, run the following command in the project directory:

```bash
gulp watch
```

This command will execute Gulp tasks defined in `gulpfile.js` to minify CSS, JavaScript, and image files. The processed files will be saved in the `assets/` directory, ready to be used in your Shopify theme.

## Gulp Tasks

The `gulpfile.js` contains tasks to handle various types of assets:

- **CSS**: Minifies CSS files.
- **JavaScript**: Minifies JavaScript files.
- **Images**: Optimizes image files.

Each task processes the files in the `dev/` directory and outputs the minified versions to the `assets/` directory.

## Contributing

If you would like to contribute to this project, please follow these guidelines:

1. Fork the repository.
2. Create a new branch with a descriptive name (`git checkout -b branch-name`).
3. Make your changes.
4. Commit your changes (`git commit -m 'Add some feature'`).
5. Push to the branch (`git push origin branch-name`).
6. Create a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.
