async function loadTokens() {
  tokenSelect.innerHTML = "";
  try {
    // SOL balance
    const solBalance = await connection.getBalance(wallet);
    const solOption = document.createElement("option");
    solOption.value = "SOL";
    solOption.textContent = `SOL — balance: ${(solBalance / 1e9).toFixed(6)}`;
    tokenSelect.appendChild(solOption);

    // SPL Tokens
    const tokenAccounts = await connection.getParsedTokenAccountsByOwner(wallet, {
      programId: splToken.TOKEN_PROGRAM_ID
    });

    tokenAccounts.value.forEach(acc => {
      const info = acc.account.data.parsed.info;
      const mint = info.mint;
      const amount = info.tokenAmount?.uiAmount || 0;
      if (amount > 0) {
        const option = document.createElement("option");
        option.value = mint;
        option.textContent = `${mint} — balance: ${amount}`;
        tokenSelect.appendChild(option);
      }
    });

    if(tokenAccounts.value.length === 0) {
      const opt = document.createElement("option");
      opt.textContent = "No SPL tokens found";
      tokenSelect.appendChild(opt);
    }
  } catch(e) {
    log("Error loading tokens: " + e.message);
    const opt = document.createElement("option");
    opt.textContent = "Error loading tokens";
    tokenSelect.appendChild(opt);
  }
}
