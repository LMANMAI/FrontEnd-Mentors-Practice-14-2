import { useEffect, useState } from "react";
import { Grid, GridItem, Image, Stack, Button, Text } from "@chakra-ui/react";
import { Link, useSearchParams } from "react-router-dom";
import { ISneaker } from "../interfaces";
import {
  selecBrands,
  selectSneakers,
  selectSearch,
  selectCountLimit,
  selectTotalSneakers,
  setSneakerActive,
  setCounterState,
} from "../features/sneakersSlice";
import Spinkit from "../components/SpinKit";
import { useDispatch, useSelector } from "react-redux";
import { filterByBrand, filterByGender } from "../app/helper";

const Collections = (props: any) => {
  //states
  const [loadign, setLoadign] = useState<boolean>(true);
  const [secondarray, setSecondArray] = useState<any[]>([]);
  const [count, setCount] = useState<number>(0);
  //selectors
  const dispatch = useDispatch();
  const sneakers = useSelector(selectSneakers);
  const brandsArray = useSelector(selecBrands);
  const search = useSelector(selectSearch);
  const limit = useSelector(selectCountLimit);
  const total = useSelector(selectTotalSneakers);
  //query params
  let [searchParams] = useSearchParams();
  let gender = searchParams.get("gender");
  let brand = searchParams.get("brand");
  const [producfilter, setProductsFilter] = useState<any[]>([]);
  const [countPage, setCountPage] = useState<number>(1);
  useEffect(() => {
    if (brandsArray.length === 0 && !gender) {
      setSecondArray([]);
      setProductsFilter(sneakers);
      return;
    } else if (gender) {
      let arrayfilter = filterByGender(total, gender);
      setProductsFilter(arrayfilter);
      return;
    } else if (brand || brandsArray.length > 1) {
      let brand_exist = brandsArray.find((item) => item === brand);

      if (brand_exist) {
        setSecondArray([...secondarray, filterByBrand(total, brand_exist)]);
        return;
      } else {
        const newArray = producfilter.filter((item) => item.brand !== brand);
        setProductsFilter(newArray);
        setSecondArray(newArray);
      }
    }
  }, [gender, brand, brandsArray]);

  useEffect(() => {
    let tempData: any[] = [];
    secondarray.map((item) => {
      tempData = tempData.concat(item);
      setProductsFilter(tempData);
    });
  }, [secondarray]);

  useEffect(() => {
    setTimeout(() => {
      if (sneakers) {
        setLoadign(false);
        setProductsFilter(sneakers);
      }
    }, 300);
  }, [props.history, sneakers]);
  useEffect(() => {
    let array: any = [];
    total?.filter((item) => {
      if (search === "") {
        setProductsFilter(sneakers);
      } else if (item.name.toLowerCase().includes(search.toLocaleLowerCase())) {
        array.push(item);
        setProductsFilter(array);
      }
    });
  }, [search]);

  useEffect(() => {
    dispatch(setCounterState(count));
  }, [count]);
  return (
    <Stack>
      {loadign ? (
        <Spinkit />
      ) : (
        <>
          <Stack direction="row" justifyContent="center" alignItems="center">
            {count <= 0 ? null : (
              <Button
                variant="primary"
                onClick={() => {
                  setCountPage(countPage - 1);
                  setCount(count - 10);
                }}
              >
                {"<"}
              </Button>
            )}
            <Text>
              Page {countPage} to {Math.ceil(limit / 10)}
            </Text>
            {count + 10 > limit ? null : (
              <Button
                variant="primary"
                onClick={() => {
                  setCount(count + 10);
                  setCountPage(countPage + 1);
                }}
              >
                {">"}
              </Button>
            )}
          </Stack>
          <Grid
            templateColumns={{
              base: "repeat(auto-fit, minmax(150px, 1fr))",
              md: "repeat(auto-fit, minmax(210px, 1fr))",
            }}
            gap={4}
            placeItems="center"
          >
            {producfilter &&
              producfilter?.map((sneaker: ISneaker, index: number) => (
                <Link
                  to={`/${sneaker?._id}`}
                  key={index}
                  onClick={() => dispatch(setSneakerActive(sneaker))}
                >
                  <GridItem
                    padding={2}
                    maxWidth="250px"
                    minHeight="250px"
                    height="100%"
                    borderRadius="15px"
                    textAlign="center"
                    boxShadow="rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px"
                  >
                    <Image src={sneaker.posterPathImage} />
                    <p>{sneaker.name}</p>
                  </GridItem>
                </Link>
              ))}
          </Grid>
        </>
      )}
    </Stack>
  );
};

export default Collections;
