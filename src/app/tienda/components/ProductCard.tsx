"use client";

import Image from "next/image";
import { useState } from "react";

export type ProductColor = { label: string; image: string };

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  badge?: string;
  colors: ProductColor[];
  sizes: string[];
  extraImages?: string[]; // front/back toggle
};

const WHATSAPP_NUMBER = "5491157541046";

function buildWhatsappUrl(product: Product, size: string, color: string) {
  const text = encodeURIComponent(
    `Hola! Quiero consultar por:\n*${product.name}*\nTalle: ${size}\nColor: ${color}\n¿Está disponible?`
  );
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
}

export default function ProductCard({ product }: { product: Product }) {
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [selectedSize, setSelectedSize] = useState("");
  const [imageIndex, setImageIndex] = useState(0);

  const allImages = [selectedColor.image, ...(product.extraImages ?? [])];
  const currentImage = allImages[imageIndex] ?? selectedColor.image;

  function handleColorChange(color: ProductColor) {
    setSelectedColor(color);
    setImageIndex(0);
  }

  return (
    <div className="group flex flex-col rounded-3xl border border-white/10 bg-white/5 overflow-hidden hover:border-white/20 transition-colors">
      {/* Imagen */}
      <div className="relative aspect-4/5 overflow-hidden bg-white/5">
        <Image
          src={currentImage}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {/* Badge */}
        {product.badge && (
          <div className="absolute top-3 left-3">
            <span className="rounded-full bg-emerald-400/20 border border-emerald-400/30 px-2.5 py-1 text-xs font-medium text-emerald-300 backdrop-blur-sm">
              {product.badge}
            </span>
          </div>
        )}

        {/* Toggle frente/espalda si hay extra images */}
        {allImages.length > 1 && (
          <div className="absolute bottom-3 right-3 flex gap-1.5">
            {allImages.map((_, i) => (
              <button
                key={i}
                onClick={() => setImageIndex(i)}
                className={`h-2 w-2 rounded-full transition-all ${
                  imageIndex === i ? "bg-white scale-125" : "bg-white/40 hover:bg-white/70"
                }`}
              />
            ))}
          </div>
        )}

        {/* Label frente/espalda */}
        {allImages.length > 1 && (
          <div className="absolute bottom-3 left-3">
            <span className="rounded-lg bg-black/40 backdrop-blur-sm px-2 py-1 text-xs text-white/70">
              {imageIndex === 0 ? "Frente" : "Espalda"}
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col flex-1 p-5 gap-4">
        {/* Nombre y precio */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-base leading-tight">{product.name}</h3>
          <div className="text-right shrink-0">
            {product.originalPrice && (
              <p className="text-xs text-white/40 line-through">
                ${product.originalPrice.toLocaleString("es-AR")}
              </p>
            )}
            <p className="font-bold text-white">
              ${product.price.toLocaleString("es-AR")}
            </p>
          </div>
        </div>

        <p className="text-sm text-white/60 leading-relaxed">{product.description}</p>

        {/* Colores */}
        {product.colors.length > 1 && (
          <div>
            <p className="text-xs text-white/40 mb-2">
              Color: <span className="text-white/70">{selectedColor.label}</span>
            </p>
            <div className="flex gap-2">
              {product.colors.map((color) => (
                <button
                  key={color.label}
                  onClick={() => handleColorChange(color)}
                  className={`rounded-xl px-3 py-1.5 text-xs border transition-all ${
                    selectedColor.label === color.label
                      ? "border-white/40 bg-white/15 text-white"
                      : "border-white/10 bg-white/5 text-white/50 hover:border-white/20 hover:text-white/80"
                  }`}
                >
                  {color.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Talles */}
        <div>
          <p className="text-xs text-white/40 mb-2">
            Talle:{" "}
            {selectedSize ? (
              <span className="text-white/70">{selectedSize}</span>
            ) : (
              <span className="text-amber-400/70">Seleccioná un talle</span>
            )}
          </p>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`h-9 w-9 rounded-xl text-xs font-medium border transition-all ${
                  selectedSize === size
                    ? "border-emerald-400/50 bg-emerald-400/15 text-emerald-300"
                    : "border-white/10 bg-white/5 text-white/50 hover:border-white/20 hover:text-white/80"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-auto pt-2">
          {selectedSize ? (
            <a
              href={buildWhatsappUrl(product, selectedSize, selectedColor.label)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full rounded-2xl bg-linear-to-r from-emerald-400 to-cyan-400 px-4 py-3 text-sm font-semibold text-black hover:opacity-90 transition-opacity"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Consultar por WhatsApp
            </a>
          ) : (
            <button
              disabled
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/40 cursor-not-allowed"
            >
              Seleccioná un talle para continuar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
