'use client'

import { NetworkType } from '@/lib/context/network-context';
import { getFlowscanUrl } from '@/lib/utils/network';
import { Copy, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { shortenAddress } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { analytics, EventCategory, EventName } from '@/lib/utils/analytics';

interface ResultsTableProps {
  results: Array<{
    flowAddress: string | null;
    evmAddress: string | null;
  }>;
  network: NetworkType;
}

export function ResultsTable({ results, network }: ResultsTableProps) {
  const { toast } = useToast();

  const copyToClipboard = (text: string, type: 'flow' | 'evm') => {
    navigator.clipboard.writeText(text).then(() => {
      analytics.trackEvent(EventCategory.INTERACTION, EventName.COPY_ADDRESS, {
        addressType: type,
        network
      });
      toast({
        title: "Address copied!"
      });
    });
  };

  const handleFlowscanClick = (type: 'flow' | 'evm') => {
    analytics.trackEvent(EventCategory.INTERACTION, EventName.FLOWSCAN_CLICK, {
      addressType: type,
      network
    });
  };

  const exportToCSV = () => {
    const csvData = `Flow Address,EVM Address\n${results.map(r => `${r.flowAddress || 'N/A'},${r.evmAddress || 'N/A'}`).join('\n')}`;
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'address-lookup-results.csv';

    analytics.trackEvent(EventCategory.INTERACTION, EventName.EXPORT_CSV, {
      addressCount: results.length
    });

    link.click();
    window.URL.revokeObjectURL(url);
  };

  const renderAddress = (address: string | null, type: 'flow' | 'evm') => {
    if (!address || address === 'N/A') {
      return <span className="na-text">N/A</span>;
    }

    const baseUrl = getFlowscanUrl(network, type);
    const formattedAddress = type === 'flow' && address.startsWith('0x')
      ? address.slice(2)
      : address;
    const url = type === 'flow'
      ? `${baseUrl}/account/${formattedAddress}`
      : `${baseUrl}/address/${address}`;

    return (
      <div className="address-container">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="link-hover"
          onClick={() => handleFlowscanClick(type)}
        >
          {window.innerWidth > 640 ? address : shortenAddress(address)}
        </a>
        <button
          onClick={() => copyToClipboard(address, type)}
          className="copy-button"
          aria-label={`Copy ${type === 'flow' ? 'Flow' : 'EVM'} address`}
        >
          <Copy className="copy-icon" />
        </button>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          onClick={exportToCSV}
          variant="outline"
          size="sm"
          className="gap-2"
        >
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </div>

      <div className="rounded-lg border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Flow Address</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">EVM Address</th>
              </tr>
            </thead>
            <tbody>
              {results.map((result, index) => (
                <tr key={index} className="border-b">
                  <td className="p-4 align-middle">
                    {renderAddress(result.flowAddress, 'flow')}
                  </td>
                  <td className="p-4 align-middle">
                    {renderAddress(result.evmAddress, 'evm')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}