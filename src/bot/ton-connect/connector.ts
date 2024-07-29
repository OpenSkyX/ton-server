import TonConnect from '@tonconnect/sdk';
import { AccountInfoManager } from '../../Manager/accountInfo.manager';

type StoredConnectorData = {
    connector: TonConnect;
    timeout: ReturnType<typeof setTimeout>;
    onConnectorExpired: ((connector: TonConnect) => void)[];
};

const connectors = new Map<number, StoredConnectorData>();

export function getConnector(
    chatId: number,
    onConnectorExpired?: (connector: TonConnect) => void
): TonConnect {
    let storedItem: StoredConnectorData;
    if (connectors.has(chatId)) {
        storedItem = connectors.get(chatId)!;
        clearTimeout(storedItem.timeout);
    } else {
        storedItem = {
            connector: new TonConnect({
                // manifestUrl: "https://ton-connect.github.io/demo-dapp-with-react-ui/tonconnect-manifest.json"
                manifestUrl: "https://ivory-passive-possum-495.mypinata.cloud/ipfs/Qme8a1RsfzByoZJsbShV1Lgj9hkgP75d4i4efJ9QTtrxxh",
                storage: new AccountInfoManager()
            }),
            onConnectorExpired: []
        } as unknown as StoredConnectorData;
    }

    if (onConnectorExpired) {
        storedItem.onConnectorExpired.push(onConnectorExpired);
    }

    storedItem.timeout = setTimeout(() => {
        if (connectors.has(chatId)) {
            const storedItem = connectors.get(chatId)!;
            storedItem.connector.pauseConnection();
            storedItem.onConnectorExpired.forEach(callback => callback(storedItem.connector));
            connectors.delete(chatId);
        }
    }, Number(600000));

    connectors.set(chatId, storedItem);
    return storedItem.connector;
}