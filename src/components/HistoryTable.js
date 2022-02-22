import React, { useState, useEffect } from 'react'
import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Collapse from '@mui/material/Collapse'
import IconButton from '@mui/material/IconButton'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell, { tableCellClasses } from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp'
import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown'
import { Grid, TablePagination } from '@mui/material'

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.dark,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}))

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}))

function Row(props) {
  const { row } = props
  const [open, setOpen] = React.useState(false)

  return (
    <React.Fragment>
      <StyledTableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <StyledTableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </StyledTableCell>
        <StyledTableCell align="center">
          <Grid
            paddingX={'1px'}
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            container
          >
            <Grid item xs={6}>
              {row[0] === '1' ? 'Received' : 'Sent'}
            </Grid>
            <Grid item xs={6}>
              {row[0] === '1' ? <ArrowCircleDownIcon /> : <ArrowCircleUpIcon />}
            </Grid>
          </Grid>
        </StyledTableCell>
        <StyledTableCell align="center">
          <a
            style={{ color: '#0072ce' }}
            href={`https://explorer.testnet.near.org/accounts/${row[5]}`}
            target="_blank"
          >
            {row[5]}
          </a>
        </StyledTableCell>
        <StyledTableCell align="center">{row[3]} NEAR</StyledTableCell>
        <StyledTableCell align="center">{row[1]}</StyledTableCell>
      </StyledTableRow>
      <StyledTableRow>
        <StyledTableCell
          style={{ paddingBottom: 0, paddingTop: 0 }}
          colSpan={6}
        >
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="button" gutterBottom component="div">
                Transaction Details
              </Typography>
              <Typography variant="caption" gutterBottom>
                &emsp;&emsp;&emsp;Message : {row[4]}
              </Typography>
            </Box>
          </Collapse>
        </StyledTableCell>
      </StyledTableRow>
    </React.Fragment>
  )
}

export default function CollapsibleTable() {
  const [transactionHistory, setTransactionHistory] = React.useState([])
  useEffect(() => {
    const isRegisteredFunction = async () => {
      const isRegistered = await window.contract.isUserRegistered({
        userId: window.accountId,
      })

      if (!isRegistered) {
        console.log(window.location)
        window.location.replace(window.location.origin + '/register')
      }
    }
    isRegisteredFunction()

    const transactionListFunction = async () => {
      let transactionHistoryData = await window.contract.getTransactionHistory({
        userId: window.accountId,
      })

      transactionHistoryData.sort((a, b) => {
        if (a[1] === b[1]) {
          return 0
        } else {
          return new Date(a[1]) < new Date(b[1]) ? 1 : -1
        }
      })
      console.log(transactionHistoryData)
      setTransactionHistory(transactionHistoryData)
    }
    transactionListFunction()
  }, [])

  const noTransactionsFound = () => {
    if (transactionHistory.length === 0) {
      return <>No Previous Transactions Found</>
    }
  }

  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(10)

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value)
    setPage(0)
  }

  return (
    <Box container spacing={2} marginTop={'15vh'}>
      <Paper>
        <TableContainer component={Paper}>
          <Table aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell />
                <StyledTableCell align="center">
                  Transaction Type
                </StyledTableCell>
                <StyledTableCell align="center">
                  Transacted To/From
                </StyledTableCell>
                <StyledTableCell align="center">Amount</StyledTableCell>
                <StyledTableCell align="center">
                  {'Date & Time'}
                </StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transactionHistory
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => (
                  <Row key={row[2]} row={row} />
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 50, 100]}
          component="div"
          count={transactionHistory.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  )
}
