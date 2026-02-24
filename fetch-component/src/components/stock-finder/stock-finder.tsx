import { Component, Event, EventEmitter, h, State } from '@stencil/core/internal';
import { AV_API_KEY } from '../../global/global';

@Component({
  tag: 'uc-stock-finder',
  styleUrl: 'stock-finder.css',
  shadow: true,
})
export class StockFinder {
  stockNameInput: HTMLInputElement;
  @State() searchResults: { symbol: string; name: string }[] = [];
  @Event({ bubbles: true, composed: true }) ucSymbolSelected: EventEmitter<string>;

  async onFindStocks(event: Event) {
    event.preventDefault();
    const stockName = this.stockNameInput.value;
    try {
      const response = await fetch(`https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${stockName}&apikey=${AV_API_KEY}`);
      const data: { bestMatches: { '1. symbol': string; '2. name': string }[] } = await response.json();
      this.searchResults = data.bestMatches.map(match => ({
        symbol: match['1. symbol'],
        name: match['2. name'],
      }));
    } catch (error) {}
  }

  onSelectSymbol(symbol: string) {
    this.ucSymbolSelected.emit(symbol);
  }

  render() {
    return [
      <form onSubmit={event => this.onFindStocks(event)}>
        <input type="text" id="stock-symbol" ref={el => (this.stockNameInput = el as HTMLInputElement)} />
        <button type="submit">Find!</button>
      </form>,
      this.searchResults.length > 0 && (
        <ul>
          {this.searchResults.map(result => (
            <li key={result.symbol} onClick={() => this.onSelectSymbol(result.symbol)}>
              {result.name} ({result.symbol})
            </li>
          ))}
        </ul>
      ),
    ];
  }
}
