import {
  Context,
  u128,
  logging,
  PersistentMap,
  math,
  ContractPromiseBatch,
} from 'near-sdk-as'
const UserIDArray = new PersistentMap<string, string[]>('UserID Array')
const User = new PersistentMap<string, string[]>('User')

const TransferHistoryKeyArray = new PersistentMap<string, string[]>(
  'Transfer History Key Array'
)
const TransferHistoryDetail = new PersistentMap<string, string[]>(
  'Transfer History Detail'
)
const ReceiveHistoryKeyArray = new PersistentMap<string, string[]>(
  'Receive History Key Array'
)
const ReceiveHistoryDetail = new PersistentMap<string, string[]>(
  'Receive History Detail'
)

const RequestedTo = new PersistentMap<string, string[]>(
  'Requested To Key Array'
)
const RequestedBy = new PersistentMap<string, string[]>(
  'Requested By Key Array'
)

const RequestedToDetail = new PersistentMap<string, string[]>(
  'Requested To Detail'
)

const RequestedByDetail = new PersistentMap<string, string[]>(
  'Requested By Detail'
)

// View Methods
export function getWalletBalance(userId: string): u128 {
  let bal = Context.accountBalance

  return bal
}

export function getUserList(): string[] {
  if (UserIDArray.contains('AllUsers')) {
    return UserIDArray.getSome('AllUsers')
  } else {
    logging.log('no users found')
    return []
  }
}

export function isUserRegistered(userId: string): bool {
  return User.contains(userId)
}

export function getUserDetails(userId: string): string[] {
  return User.getSome(userId)
}

export function getTransferHistoryKeyArray(userId: string): string[] {
  logging.log(TransferHistoryKeyArray.contains(userId))
  if (TransferHistoryKeyArray.contains(userId)) {
    logging.log(TransferHistoryKeyArray.getSome(userId))
    return TransferHistoryKeyArray.getSome(userId)
  } else {
    return []
  }
}

export function getTransferHistoryDetail(transferId: string): string[] {
  logging.log(
    `${transferId} present? ${TransferHistoryDetail.contains(transferId)}`
  )
  if (TransferHistoryDetail.contains(transferId)) {
    return TransferHistoryDetail.getSome(transferId)
  } else {
    return []
  }
}

export function getReceiveHistoryKeyArray(userId: string): string[] {
  logging.log(ReceiveHistoryKeyArray.contains(userId))
  if (ReceiveHistoryKeyArray.contains(userId)) {
    logging.log(ReceiveHistoryKeyArray.getSome(userId))
    return ReceiveHistoryKeyArray.getSome(userId)
  } else {
    return []
  }
}

export function getReceiveHistoryDetail(receiveId: string): string[] {
  logging.log(
    `${receiveId} present? ${ReceiveHistoryDetail.contains(receiveId)}`
  )
  if (ReceiveHistoryDetail.contains(receiveId)) {
    return ReceiveHistoryDetail.getSome(receiveId)
  } else {
    return []
  }
}

export function getTransferHistory(userId: string): string[][] {
  let history: string[][] = []
  let keyArray = TransferHistoryKeyArray.getSome(userId)

  for (let i = 0; i < keyArray.length; i++) {
    if (TransferHistoryDetail.contains(keyArray[i])) {
      history.push(TransferHistoryDetail.getSome(keyArray[i]))
    }
  }
  return history
}

export function getReceiveHistory(userId: string): string[][] {
  let history: string[][] = []
  let keyArray = ReceiveHistoryKeyArray.getSome(userId)

  for (let i = 0; i < keyArray.length; i++) {
    if (ReceiveHistoryDetail.contains(keyArray[i])) {
      history.push(ReceiveHistoryDetail.getSome(keyArray[i]))
    }
  }
  return history
}

export function getTransactionHistory(userId: string): string[][] {
  let history: string[][] = []
  let keyArray = TransferHistoryKeyArray.getSome(userId)

  for (let i = 0; i < keyArray.length; i++) {
    if (TransferHistoryDetail.contains(keyArray[i])) {
      let record: string[] = TransferHistoryDetail.getSome(keyArray[i])
      record.unshift('0')
      history.push(record)
    }
  }

  keyArray = ReceiveHistoryKeyArray.getSome(userId)

  for (let i = 0; i < keyArray.length; i++) {
    if (ReceiveHistoryDetail.contains(keyArray[i])) {
      let record: string[] = ReceiveHistoryDetail.getSome(keyArray[i])
      record.unshift('1')
      history.push(record)
    }
  }
  return history
}

export function getRequestedByDetails(userId: string): string[][] {
  let requestDetails: string[][] = []
  let keyArray = RequestedBy.getSome(userId)

  for (let i = 0; i < keyArray.length; i++) {
    if (RequestedByDetail.contains(keyArray[i])) {
      let record: string[] = RequestedByDetail.getSome(keyArray[i])
      requestDetails.push(record)
    }
  }

  return requestDetails
}

// Change Methods

export function registerUser(
  userId: string,
  fName: string,
  lName: string,
  email: string,
  mobile: string,
  dob: string
): void {
  if (User.contains(userId)) {
    logging.log('Account cannot be registered. This user already exists')
  } else {
    var user = [userId, fName, lName, email, mobile, dob]

    User.set(userId, user)
    logging.log('User Informations added')

    if (UserIDArray.contains('AllUsers')) {
      let tempArray = UserIDArray.getSome('AllUsers')
      tempArray.push(userId)
      UserIDArray.set('AllUsers', tempArray)
    } else {
      UserIDArray.set('AllUsers', [userId])
    }
    logging.log('User added to user list')

    TransferHistoryKeyArray.set(userId, [])
    logging.log('Transfer History Key Array Created')
    logging.log(TransferHistoryKeyArray.getSome(userId))

    ReceiveHistoryKeyArray.set(userId, [])
    logging.log('Receive History Key Array Created')
    logging.log(ReceiveHistoryKeyArray.getSome(userId))
  }
}

// export function createTransactionLogs(
//   sender: string,
//   receiver: string,
//   amount: u128,
//   message: string,
//   datetime: string):void{
//   logging.log('adding log');

//   let transferId = `${math.hash32<string>(sender + datetime)}`;

//   if (TransferHistoryKeyArray.contains(sender)) {
//     let tempArray = TransferHistoryKeyArray.getSome(sender);
//     tempArray.push(transferId);
//     TransferHistoryKeyArray.set(sender, tempArray);
//   } else {
//     TransferHistoryKeyArray.set(sender, [transferId]);
//   }

//   TransferHistoryDetail.set(transferId, [
//     datetime,
//     transferId,
//     `${amount}`,
//     message,
//     receiver,
//   ]);

//   logging.log("Send log added");

//   if (ReceiveHistoryKeyArray.contains(receiver)) {
//     let tempArray = ReceiveHistoryKeyArray.getSome(receiver);
//     tempArray.push(transferId);
//     ReceiveHistoryKeyArray.set(receiver, tempArray);
//   } else {
//     ReceiveHistoryKeyArray.set(receiver, [transferId]);
//   }

//   ReceiveHistoryDetail.set(transferId, [
//     datetime,
//     transferId,
//     `${amount}`,
//     message,
//     sender,
//   ]);

//   logging.log("Receive log added");
// }

export function transferNearTokens(
  sender: string,
  receiver: string,
  amount: string,
  message: string,
  datetime: string,
  parsedAmount: u128
): void {
  logging.log('adding log')

  let transferId = `${math.hash32<string>(sender + datetime)}`

  if (TransferHistoryKeyArray.contains(sender)) {
    let tempArray = TransferHistoryKeyArray.getSome(sender)
    tempArray.push(transferId)
    TransferHistoryKeyArray.set(sender, tempArray)
  } else {
    TransferHistoryKeyArray.set(sender, [transferId])
  }

  TransferHistoryDetail.set(transferId, [
    datetime,
    transferId,
    `${amount}`,
    message,
    receiver,
  ])

  logging.log('Send log added')

  if (ReceiveHistoryKeyArray.contains(receiver)) {
    let tempArray = ReceiveHistoryKeyArray.getSome(receiver)
    tempArray.push(transferId)
    ReceiveHistoryKeyArray.set(receiver, tempArray)
  } else {
    ReceiveHistoryKeyArray.set(receiver, [transferId])
  }

  ReceiveHistoryDetail.set(transferId, [
    datetime,
    transferId,
    `${amount}`,
    message,
    sender,
  ])

  logging.log('Receive log added')
  // ContractPromiseBatch.create(receiver).transfer(parsedAmount);
  logging.log('success! Transfered to ' + receiver)
}

export function requestMoney(
  sender: string,
  receiver: string,
  amount: string,
  message: string,
  datetime: string
): void {
  let requestID: string = `${math.hash32<string>(sender + receiver + datetime)}`
  if (RequestedBy.contains(receiver)) {
    let tempArray = RequestedBy.getSome(receiver)
    tempArray.push(requestID)
    RequestedBy.set(receiver, tempArray)
  } else {
    RequestedBy.set(receiver, [requestID])
  }

  if (RequestedTo.contains(sender)) {
    let tempArray = RequestedTo.getSome(sender)
    tempArray.push(requestID)
    RequestedTo.set(sender, tempArray)
  } else {
    RequestedTo.set(sender, [requestID])
  }

  RequestedByDetail.set(requestID, [
    datetime,
    requestID,
    `${amount}`,
    message,
    sender,
  ])

  RequestedToDetail.set(requestID, [
    datetime,
    requestID,
    `${amount}`,
    message,
    receiver,
  ])
}

export function removeMoneyRequest(
  sender: string,
  receiver: string,
  requestId: string
): void {
  if (RequestedBy.contains(sender)) {
    let tempArray = RequestedBy.getSome(sender)
    let index = tempArray.indexOf(requestId, 0)
    if (index > -1) {
      tempArray.splice(index, 1)
    }
    RequestedBy.set(sender, tempArray)
    logging.log(RequestedBy.getSome(sender))
  } else {
    RequestedBy.set(sender, [])
  }

  if (RequestedTo.contains(receiver)) {
    logging.log(RequestedTo.getSome(receiver))
    let tempArray = RequestedTo.getSome(receiver)
    let index = tempArray.indexOf(requestId, 0)
    if (index > -1) {
      tempArray.splice(index, 1)
    }
    RequestedTo.set(receiver, tempArray)

    logging.log(RequestedTo.getSome(receiver))
  } else {
    RequestedTo.set(receiver, [])
  }
}
