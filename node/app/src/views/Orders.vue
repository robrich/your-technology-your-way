<template>
  <div class="orders">
    <aside class="new-order">
      <h3>Add new order</h3>
      <form @submit.prevent="save">
        <div class="form-group">
          <label>Description:</label>
          <input type="text" class="form-control" v-model="description" />
        </div>
        <div class="form-group">
          <label>Quantity:</label>
          <input type="number" class="form-control" v-model.number="quantity" />
        </div>
        <div class="form-group">
          <label>Total:</label>
          <input type="number" class="form-control" v-model.number="total" />
        </div>
        <div class="input-group">
          <button type="submit" class="btn btn-primary">Save order</button>
          <button type="reset" class="btn btn-secondary" @click.prevent="refresh">Refresh orders</button>
        </div>
      </form>
    </aside>

    <hr />

    <article>
      <h3>Orders</h3>

      <p v-if="!orders">Loading...</p>
      <table v-if="orders" class="table responsive-table">
        <thead>
          <tr>
            <th scope="col">Order id</th>
            <th scope="col">Description</th>
            <th scope="col">Quantity</th>
            <th scope="col">Total</th>
            <th scope="col">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in orders" :key="order.orderId">
            <th scope="row">{{order.orderId}}</th>
            <td data-title="Description">{{order.description}}</td>
            <td data-title="Quantity">{{order.quantity}}</td>
            <td data-title="Total">{{order.total}}</td>
            <td data-title="Status">{{order.status}}</td>
          </tr>
        </tbody>
      </table>
    </article>
  </div>
</template>

<script>
import axios from 'axios';

export default {

  data() {
    return {
      description: '',
      quantity: 0,
      total: 0,
      orders: null
    };
  },

  mounted: function () {
    this.refresh();
  },

  methods: {

    async save() {

      const order = {
        description: this.description,
        quantity: this.quantity,
        total: this.total,
        status: 'Pending'
      };

      await axios.post('/api/order/', order);

      await this.refresh();
      this.description = '';
      this.quantity = 0;
      this.total = 0;
    },

    async refresh() {
      const res = await axios.get('/api/order/');
      this.orders = res.data;
    }
  }

}
</script>

<style scoped>
.orders {
  margin-left: 2em;
  margin-right: 2em;
}
</style>
