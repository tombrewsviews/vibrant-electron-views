let findComponentInPlace = (place, componentType) => {
  let component = place.address_components.find(ac =>
    ac.types.includes(componentType)
  );
  return component ? component.long_name : '';
};

let mapPlaceToAddress = place => ({
  street: `${findComponentInPlace(
    place,
    'street_number'
  )} ${findComponentInPlace(place, 'route')}`.trim(),
  city:
    findComponentInPlace(place, 'locality') ||
    findComponentInPlace(place, 'sublocality'),
  state: findComponentInPlace(place, 'administrative_area_level_1'),
  zip: findComponentInPlace(place, 'postal_code'),
});

export default mapPlaceToAddress;
