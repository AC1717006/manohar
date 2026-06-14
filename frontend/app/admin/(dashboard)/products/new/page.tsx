import ProductForm from "@/components/admin/ProductForm";

export default function NewProductPage() {
  return (
    <div>
      <h1 className="font-serif text-2xl font-semibold text-gradient-gold">Add Product</h1>
      <div className="mt-6">
        <ProductForm />
      </div>
    </div>
  );
}
