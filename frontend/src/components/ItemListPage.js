import React from 'react';
import UpcomingAuctionSection from '../components/UpcomingAuctionSection';
import ItemListView from '../components/ItemsListView';

const ItemListPage = () => {
  return (
    <div>
      <UpcomingAuctionSection />
      <ItemListView />
    </div>
  );
};

export default ItemListPage;
