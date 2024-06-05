document.addEventListener('alpine:init', () => {
    Alpine.data('products', () => ({
        items: [
            { id: 1, name: 'dinamo mobil', img: '1.jpg', price: 100000}, 
            { id: 2, name: 'pipa racing', img: '2.jpg', price: 150000}, 
            { id: 3, name: 'spare parts', img: '3.jpg', price: 135000}, 
            { id: 4, name: 'ban mobil racing', img: '4.jpg', price: 600000}, 
            { id: 5, name: 'semua jenis baut mobil', img: '5.jpg', price: 110000}, 
        ],
    }));

    Alpine.store('cart', {
        items: [],
        total: 0,
        quantity: 0,
        add(newItem) {
            // cek dulu bray
            const cartItem = this.items.find((item) => item.id === newItem.id);
            // jika belum ada / cart kosong
            if(!cartItem) {
                this.items.push({...newItem, quantity: 1, total: newItem.price });
                this.quantity++;
                this.total += newItem.price;
            } else {
                // jika barang belum ada, cek apakah barang beda atau sama dengan yang ada di cart
                this.items = this.items.map((item) => {
                    // jika barang berbeda
                    if (item.id !== newItem.id) {
                        return item;
                    } else {
                        // jika barang sudah ada, tambah quantity dan totalnya
                        item.quantity++;
                        item.total = item.price * item.quantity;
                        this.quantity++;
                        this.total += item.price;
                        return item;
                    }
                }) 
            }
        },
        remove(id) {
            // ambil item yang mau di remove berdasarkan idnya
            const cartItem = this.items.find((item) => item.id === id);
            // jika item lebih dari 1
            if(cartItem.quantity > 1) {
                // telusuri saatu satu
                this.items = this.items.map((item) => {
                    // jika bukan barang yg di klik
                    if(item.id !== id) {
                        return item;
                    } else {
                        item.quantity--;
                        item.total = item.price * item.quantity;
                        this.quantity--;
                        this.total -= item.price;
                        return item;
                    }
                });
            } else if (cartItem.quantity === 1) {
                // jika barang sisa 1
                this.items = this.items.filter((item) => item.id !== id);
                this.quantity--;
                this.total -= cartItem.price;
            }
        },
    });
});

// form validasi
const checkoutButton = document.querySelector('.checkout-button');
checkoutButton.disabled = true;

const form = document.querySelector('#checkoutForm');
form.addEventListener('keyup', function() {
    for (let i = 0; i < form.elements.length; i++) {
        if (form.elements[i].value.length !== 0) {
            checkoutButton.classList.remove('disabled');
            checkoutButton.classList.add('disabled');
        } else {
            return false;
        }
    }

    checkoutButton.disabled = false;
    checkoutButton.classList.remove('disabled');
});

// kirim data ketika tombol checkout di klik
checkoutButton.addEventListener('click', function (e) {
    e.preventDefault();
    const formData = new FormData(form);
    const data = new URLSearchParams(formData);
    const objData = Object.fromEntries(data);
    const message = formatMessage(objData);
    window.open('http://wa.me/6285973789317?text=' + encodeURIComponent(message));
});

// format pesan wa
const formatMessage = (obj) => {
    return `Data Customer
        Nama: ${obj.name}
        Email: ${obj.email}
        No HP: ${obj.phone}
Data pesanan
 ${JSON.parse(obj.items).map((item) => `${item.name} (${item.quantity} x ${rupiah(item.total)}) \n`)}    
TOTAL: ${rupiah(obj.total)}
TERIMA KASIH.`;
}

// konversi ke rupiah
const rupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(number);
};