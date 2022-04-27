import 'regenerator-runtime/runtime'
import React, { useState } from 'react'
import { login, logout } from './utils'
import './global.css'
let price = require('crypto-price')

import getConfig from './config'
const { networkId } = getConfig(process.env.NODE_ENV || 'development')

import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'

import ToolbarComponent from './components/Toolbar'
import DrawerComponent from './components/Drawer'
import Transfer from './components/Transfer'
import Home from './components/Home'
import Register from './components/Register'
import PageNotFound from './components/PageNotFound'
import Welcome from './components/Welcome'
import FastPayment from './components/FastPayment'
import Tabs from './components/Tabs'
import SendFastPayment from './components/SendFastPayment'
import ProceedSendFastPayment from './components/ProceedSendFastPayment'

import Box from '@mui/material/Box'
import SpeedDial from '@mui/material/SpeedDial'
import SpeedDialIcon from '@mui/material/SpeedDialIcon'
import SpeedDialAction from '@mui/material/SpeedDialAction'
import FileCopyIcon from '@mui/icons-material/FileCopyOutlined'
import BoltIcon from '@mui/icons-material/Bolt'
import PointOfSaleIcon from '@mui/icons-material/PointOfSale'
import EditIcon from '@mui/icons-material/Edit'
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner'
import { IconButton } from '@mui/material'
import Timeline from './components/HistoryTimeline'
import HistoryTable from './components/HistoryTable'
import RequestMoney from './components/RequestMoney'
import AccountMenu from './components/temp'

export default function App() {
  React.useEffect(() => {
    if (window.walletConnection.isSignedIn()) {
      const isRegisteredFunction = async () => {
        console.log('fjsrhng')

        // let bal = await window.contract.getWalletBalance({
        //   userId: window.accountId,
        // })
        // console.log(bal / 1000000000000000000000000)

        // price
        //   .getCryptoPrice('USD', 'NEAR')
        //   .then((obj) => {
        //     // Base for ex - USD, Crypto for ex - ETH
        //     console.log(obj.price * (bal / 1000000000000000000000000))
        //     console.log(obj.price)
        //   })
        //   .catch((err) => {
        //     console.log(err)
        //   })
      }
      isRegisteredFunction()
    }
  })
  const [left, changeLeft] = useState(false)

  const toggleDrawer = () => {
    changeLeft(false)
  }

  const openDrawer = () => {
    changeLeft(true)
  }

  const actions = [
    {
      icon: (
        <a href="http://localhost:1234/fastpayment">
          <IconButton aria-label="Example">
            <PointOfSaleIcon color="primary" fontSize="medium" />
          </IconButton>
        </a>
      ),
      name: 'Receive via Fast Payment',
    },
    {
      icon: (
        <Link to="/sendfastpayment">
          <IconButton aria-label="Example">
            <QrCodeScannerIcon color="primary" fontSize="medium" />
          </IconButton>
        </Link>
      ),
      name: 'Send via Fast Payment',
    },
  ]
  return (
    <Router>
      <div className="App">
        <ToolbarComponent openDrawerHandler={() => openDrawer()} />
        <DrawerComponent
          left={left}
          toggleDrawerHandler={() => toggleDrawer()}
        />

        <SpeedDial
          className="speedDial"
          ariaLabel="SpeedDial openIcon example"
          sx={{ position: 'fixed', bottom: 70, right: 30 }}
          icon={<SpeedDialIcon openIcon={<BoltIcon />} />}
        >
          {actions.map((action) => (
            <SpeedDialAction
              key={action.name}
              icon={action.icon}
              tooltipTitle={action.name}
            />
          ))}
        </SpeedDial>
      </div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/register" element={<Register />} />
        <Route path="/transfer" element={<Transfer />} />
        <Route path="/fastpayment" element={<FastPayment />} />
        <Route path="/sendfastpayment" element={<SendFastPayment />} />
        <Route path="/proceed_fastpay" element={<ProceedSendFastPayment />} />
        <Route path="/transaction_history" element={<HistoryTable />} />
        <Route path="/request_money" element={<RequestMoney />} />
        <Route path="/test" element={<AccountMenu />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </Router>
  )
}
