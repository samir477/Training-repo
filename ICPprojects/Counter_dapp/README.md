# Counter_dapp

A simple decentralized counter built with Rust and ICP. Supports increment, decrement, reset, and display functions. Features a smooth Vite + JS frontend with animations. Secure and tamper-proof on the blockchain! 🎯

## Getting Started

Welcome to your `Counter_dapp` project and the Internet Computer development community. This project includes essential files and configurations to help you quickly set up and start development.

To get started, explore the project directory structure and configuration files. Working with this project in your development environment will not affect any production deployment or identity tokens.

To learn more about the Internet Computer, check out the following documentation:

- [Quick Start](https://internetcomputer.org/docs/current/developer-docs/setup/deploy-locally)
- [SDK Developer Tools](https://internetcomputer.org/docs/current/developer-docs/setup/install)
- [Rust Canister Development Guide](https://internetcomputer.org/docs/current/developer-docs/backend/rust/)
- [ic-cdk](https://docs.rs/ic-cdk)
- [ic-cdk-macros](https://docs.rs/ic-cdk-macros)
- [Candid Introduction](https://internetcomputer.org/docs/current/developer-docs/backend/candid/)

## Running the Project Locally

To test your project locally, use the following commands:

```bash
# Start the replica (runs in the background)
dfx start --background

# Deploy the canisters to the replica and generate the Candid interface
dfx deploy
