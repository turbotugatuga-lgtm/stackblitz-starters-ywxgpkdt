const connection = new Connection(clusterApiUrl("mainnet-beta"), "confirmed"); // <-- troquei para mainnet

async function loadTokens() {
  try {
    document.getElementById("tokenSelect").innerHTML = "";

    // saldo em SOL
    const balance = await connection.getBalance(wallet);
    const solOption = document.createElement("option");
    solOption.value = "SOL";
    solOption.textContent = `SOL — saldo: ${(balance / 1e9).toFixed(4)}`;
    document.getElementById("tokenSelect").appendChild(solOption);

    // tokens SPL
    const tokenAccounts = await connection.getParsedTokenAccountsByOwner(wallet, {
      programId: splToken.TOKEN_PROGRAM_ID
    });

    if (tokenAccounts.value.length === 0) {
      return; // só SOL
    }

    tokenAccounts.value.forEach(acc => {
      const info = acc.account.data.parsed.info;
      const mint = info.mint;
      const amount = info.tokenAmount.uiAmount;
      if (amount > 0) {
        const option = document.createElement("option");
        option.value = mint;
        option.textContent = `${mint} — saldo: ${amount}`;
        document.getElementById("tokenSelect").appendChild(option);
      }
    });
  } catch (e) {
    console.error("Erro ao carregar tokens", e);
  }
}
