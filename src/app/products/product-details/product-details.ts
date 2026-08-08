import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { findProductByCode } from '../products.data';
import { placeholderImage } from '../product-card/product-card';
import { ButtonComponent } from '../../ui/button/button';

@Component({
  selector: 'app-product-details',
  imports: [ButtonComponent, RouterLink],
  templateUrl: './product-details.html'
})
export class ProductDetailsComponent {
  private readonly route = inject(ActivatedRoute);

  protected readonly product = findProductByCode(this.route.snapshot.paramMap.get('code') ?? '');
  protected readonly fallbackImage = placeholderImage;
}
