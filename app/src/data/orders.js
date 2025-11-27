export const orders = [
  {
    id: 1,
    orderNumber: "ORD-1001",
    items: [
      {
        title: "Book A",
        price: 350,
        image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&w=800"
      },
      {
        title: "Book B",
        price: 600,
        image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&w=800"
      },
    ],
    total: 950,
    date: "2025-01-12",
    status: "Delivered",
    paid: true
  },
  {
    id: 2,
    orderNumber: "ORD-1002",
    items: [
      {
        title: "Programming in JS",
        price: 450,
        image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&w=800"
      }
    ],
    total: 450,
    date: "2025-02-03",
    status: "Pending",
    paid: false
  },

];