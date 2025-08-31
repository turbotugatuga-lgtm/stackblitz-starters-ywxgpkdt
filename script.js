async function loadTokens() {
  const select = document.getElementById("tokenSelect");
  select.innerHTML = "";

  try {
    // saldo SOL
    const solBalance = await connection.getBalance(wallet);
    const solOption = document.createElement("option");
    solOption.value = "SOL";
    solOption.textContent = `SOL — saldo: ${(solBalance / 1e9).toFixed(6)}`;
    select.appendChild(solOption);

    // SPL tokens
    const tokenAccounts = await connection.getParsedTokenAccountsByOwner(wallet, {
      programId: splToken.TOKEN_PROGRAM_ID
    });

    if (tokenAccounts.value.length === 0) return;

    tokenAccounts.value.forEach(acc => {
      const info = acc.account.data.parsed.info;
      const mint = info.mint;
      const amount = info.tokenAmount?.uiAmount || 0;
      if (amount > 0) {
        const option = document.createElement("option");
        option.value = mint;
        option.textContent = `${mint} — saldo: ${amount}`;
        select.appendChild(option);
      }
    });
  } catch (e) {
    console.error("Erro ao carregar tokens:", e);
  }
}
