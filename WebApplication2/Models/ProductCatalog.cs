namespace WebApplication2
{
    public class CatalogItem
    {
        public int Id { get; set; }
        public string Name { get; set; } = "";
        public string Description { get; set; } = "";
        public decimal Price { get; set; }
        public decimal? OldPrice { get; set; }
        public string ImageUrl { get; set; } = "";
        public List<string> Tags { get; set; } = new();

        public int Stock { get; set; } = 10;      // 0 = нет в наличии
        public bool IsHit { get; set; } = false;  // хит продаж

        public bool HasDiscount => OldPrice.HasValue && OldPrice.Value > Price;
        public int DiscountPercent => HasDiscount
            ? (int)Math.Round((1 - Price / OldPrice!.Value) * 100)
            : 0;

        public bool IsOutOfStock => Stock == 0;
        public bool IsBigDiscount => DiscountPercent > 30;
    }

    public static class ProductCatalog
    {
        public static readonly List<string> AllTags = new()
        {
            "Электроника", "Аксессуары", "Хиты"
        };

        public static readonly List<CatalogItem> All = new()
        {
            new CatalogItem
            {
                Id = 1,
                Name = "Наушники Sony WH-1000XM5",
                Description = "Беспроводные наушники с активным шумоподавлением и до 30 часов работы.",
                Price = 34990m, OldPrice = 39990m,
                ImageUrl = "https://placehold.co/400x300/0d6efd/ffffff?text=Headphones",
                Tags = new() { "Электроника", "Хиты" },
                Stock = 12, IsHit = true
            },
            new CatalogItem
            {
                Id = 2,
                Name = "Смартфон Galaxy S24",
                Description = "Флагман с AMOLED-экраном 120 Гц, тройной камерой и быстрой зарядкой.",
                Price = 59990m, OldPrice = 89990m,      // скидка ~33% → большая скидка
                ImageUrl = "https://placehold.co/400x300/198754/ffffff?text=Smartphone",
                Tags = new() { "Электроника" },
                Stock = 5, IsHit = false
            },
            new CatalogItem
            {
                Id = 3,
                Name = "Ноутбук MacBook Air M3",
                Description = "Лёгкий, тихий, с автономностью до 18 часов. Идеален для работы и учёбы.",
                Price = 129990m, OldPrice = null,
                ImageUrl = "https://placehold.co/400x300/6c757d/ffffff?text=Laptop",
                Tags = new() { "Электроника" },
                Stock = 3, IsHit = false
            },
            new CatalogItem
            {
                Id = 4,
                Name = "Умные часы Apple Watch",
                Description = "Отслеживание активности, ЭКГ, Always-On дисплей и влагозащита.",
                Price = 39990m, OldPrice = 44990m,
                ImageUrl = "https://placehold.co/400x300/212529/ffffff?text=Watch",
                Tags = new() { "Электроника", "Хиты" },
                Stock = 0, IsHit = true                  // НЕТ В НАЛИЧИИ + хит
            },
            new CatalogItem
            {
                Id = 5,
                Name = "Механическая клавиатура Keychron K2",
                Description = "Компактная 75%, беспроводная, с hot-swap переключателями.",
                Price = 8990m, OldPrice = 9990m,
                ImageUrl = "https://placehold.co/400x300/dc3545/ffffff?text=Keyboard",
                Tags = new() { "Аксессуары" },
                Stock = 8, IsHit = false
            },
            new CatalogItem
            {
                Id = 6,
                Name = "Мышь Logitech MX Master 3S",
                Description = "Эргономичная мышь с бесшумными кликами и высокой точностью 8K DPI.",
                Price = 10990m, OldPrice = null,
                ImageUrl = "https://placehold.co/400x300/0dcaf0/000000?text=Mouse",
                Tags = new() { "Аксессуары" },
                Stock = 20, IsHit = false
            },
        };

        public static CatalogItem? Find(int id) => All.FirstOrDefault(p => p.Id == id);

        public static List<CatalogItem> FilterByTag(string? tag)
        {
            if (string.IsNullOrWhiteSpace(tag) || tag == "Все")
                return All;
            return All.Where(p => p.Tags.Contains(tag)).ToList();
        }
    }
}