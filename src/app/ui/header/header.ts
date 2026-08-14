import { Component, OnInit, output, signal } from '@angular/core';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html'
})
export class HeaderComponent implements OnInit {
  readonly menuClick = output<void>();
  protected readonly shopName = signal("");

  async ngOnInit() {
    const shop = await JSON.parse(localStorage.getItem("minishop_session") || "");
    shop && shop.storeName.trim() ? this.shopName.set(shop.storeName) : this.shopName.set("Indefinida");
  }
}
