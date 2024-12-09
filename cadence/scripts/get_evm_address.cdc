import EVM from 0x8c5303eaa26202d6

access(all)
fun main(from address: Address): String {
    if let evmAddress = getAuthAccount<auth(BorrowValue) &Account>(address)
        .storage.borrow<&EVM.CadenceOwnedAccount>(from: /storage/evm)
        ?.address() {
        return "0x".concat(evmAddress.toString())
    }
    return "N/A"
}