import React from "react";

const PRODUCTS = [
  {
    name: "Amazon Echo Dot",
    image: "https://m.media-amazon.com/images/I/61u48FEsQKL._AC_UL320_.jpg",
    url: "https://www.amazon.in/dp/B084J4MZK6",
    store: "Amazon"
  },
  {
    name: "Flipkart SmartBuy Headphones",
    image: "https://rukminim2.flixcart.com/image/832/832/kq6yefk0/headphone/8/2/2/fk-1000-flipkart-smartbuy-original-imag496h7gqgqg7g.jpeg",
    url: "https://www.flipkart.com/flipkart-smartbuy-fk-1000-wired-headset/p/itmffg8g7gqgqg7g",
    store: "Flipkart"
  }
];

export default function ProductLinks() {
  return (
    <div style={{ display: 'flex', gap: 20, margin: '24px 0' }}>
      {PRODUCTS.map(product => (
        <a
          key={product.name}
          href={product.url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            background: '#fff', borderRadius: 10, boxShadow: '0 2px 8px #ccc', padding: 16, width: 180, textDecoration: 'none', color: '#222'
          }}
        >
          <img src={product.image} alt={product.name} style={{ width: 120, height: 120, objectFit: 'contain', marginBottom: 10 }} />
          <div style={{ fontWeight: 'bold', marginBottom: 6 }}>{product.name}</div>
          <div style={{ fontSize: '0.95rem', color: '#3b82f6' }}>{product.store}</div>
        </a>
      ))}
    </div>
  );
}
