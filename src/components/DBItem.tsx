// ----------------------------------------------------------------------

import {
    Card,
    CardBody,
    CardHeader,
    Checkbox,
    FormControl,
    FormHelperText,
    FormLabel,
    Grid,
    GridItem,
    GridItemProps,
    Heading,
    Input,
    Select,
    Stack,
    Tag,
} from "@chakra-ui/react";
import { ChangeEvent, useState } from "react";
import { useInView } from "react-intersection-observer";
import { Element2, Element3 } from "src/@types/xml";
import { TYPES_CATEGORIES, TYPES_USAGES } from "src/data/types";
import useTypesXML from "src/hooks/useTypesXML";
import { alpha } from "src/utils/colors";

type Props = {
    data: Element2;
};

export default function DBItem({ data }: Props) {
    const { inView, ref } = useInView();
    const { json, setJson } = useTypesXML();

    const [isExpanded, setIsExpanded] = useState(false);

    const handleUpdateElement = (name: string, value: string) => {
        if (name === "usage") {
            const elementIndex = data.elements.findIndex(
                (el) => el.name === name && el.attributes?.name === value
            );

            if (elementIndex !== -1) {
                if (!json) return;

                const temp = { ...json };

                const item = temp.elements[0].elements.find(
                    (el) => el.attributes.name === data.attributes.name
                );

                item?.elements.splice(elementIndex, 1);

                setJson(temp);
            } else {
                if (!json) return;

                const temp = { ...json };

                const item = temp.elements[0].elements.find(
                    (el) => el.attributes.name === data.attributes.name
                );

                item?.elements.push({
                    name,
                    type: "element",
                    attributes: {
                        name: value,
                    },
                });

                setJson(temp);
            }
        } else if (name === "category") {
            if (!json) return;

            const temp = { ...json };

            const itemIndex = temp.elements[0].elements.findIndex(
                (el) => el.attributes.name === data.attributes.name
            );

            const categoryIndex = temp.elements[0].elements[
                itemIndex
            ].elements.findIndex((el) => el.name === "category");

            if (
                categoryIndex !== -1 &&
                temp.elements[0].elements[itemIndex].elements[categoryIndex]
                    .attributes &&
                temp.elements[0].elements[itemIndex].elements[categoryIndex]
                    .attributes!.name
            ) {
                temp.elements[0].elements[itemIndex].elements[
                    categoryIndex
                ].attributes!.name = value;
            }

            setJson(temp);
        }
    };

    return (
        <Card ref={ref} bgColor={alpha("#000000", 0.3)}>
            <CardHeader
                cursor="pointer"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <Heading fontSize="18px" color="text.light">
                    {data.attributes.name}
                </Heading>
            </CardHeader>

            {isExpanded && inView && (
                <CardBody pt={0}>
                    <Grid templateColumns="repeat(12, 1fr)" gap={6}>
                        <DBItemFormItem
                            colSpan={6}
                            label="Nominal"
                            element={data.elements.find(
                                (el) => el.name === "nominal"
                            )}
                            type="input"
                            description="The natural max of this item that will spawn"
                        />

                        <DBItemFormItem
                            colSpan={6}
                            label="Minimum"
                            element={data.elements.find(
                                (el) => el.name === "min"
                            )}
                            type="input"
                            description="The amount at which this item will begin to restock"
                        />

                        <DBItemFormItem
                            colSpan={4}
                            label="Lifetime"
                            element={data.elements.find(
                                (el) => el.name === "lifetime"
                            )}
                            type="input"
                            description="How long the item will last before despawning"
                        />

                        <DBItemFormItem
                            colSpan={4}
                            label="Restock"
                            element={data.elements.find(
                                (el) => el.name === "restock"
                            )}
                            type="input"
                            description="How long it takes for the item to restock"
                        />

                        <DBItemFormItem
                            colSpan={4}
                            label="Cost"
                            element={data.elements.find(
                                (el) => el.name === "cost"
                            )}
                            type="input"
                        />

                        <DBItemFormItem
                            colSpan={6}
                            label="Quantity Min"
                            element={data.elements.find(
                                (el) => el.name === "quantmin"
                            )}
                            type="input"
                            description="The minimum internal percentage this item can spawn with. Example: Percentage of rounds in a magazine."
                        />

                        <DBItemFormItem
                            colSpan={6}
                            label="Quantity Max"
                            element={data.elements.find(
                                (el) => el.name === "quantmax"
                            )}
                            type="input"
                            description="The maximum internal percentage this item can spawn with. Example: Percentage of rounds in a magazine."
                        />

                        <DBItemFormItem
                            colSpan={3}
                            label="Count In Cargo"
                            element={
                                data.elements.find((el) => el.name === "flags")
                                    ?.attributes?.count_in_cargo
                            }
                            type="checkbox"
                            description="If the item is in storage, should it be counted towards the spawn conditions?"
                        />

                        <DBItemFormItem
                            colSpan={3}
                            label="Count In Stash"
                            element={
                                data.elements.find((el) => el.name === "flags")
                                    ?.attributes?.count_in_hoarder
                            }
                            type="checkbox"
                            description="If the item is in a stash, should it be counted towards the spawn conditions?"
                        />

                        <DBItemFormItem
                            colSpan={3}
                            label="Count In Map"
                            element={
                                data.elements.find((el) => el.name === "flags")
                                    ?.attributes?.count_in_map
                            }
                            type="checkbox"
                            description="If the item is on the ground, should it be counted towards the spawn conditions?"
                        />

                        <DBItemFormItem
                            colSpan={3}
                            label="Count In Player"
                            element={
                                data.elements.find((el) => el.name === "flags")
                                    ?.attributes?.count_in_player
                            }
                            type="checkbox"
                            description="If the item is in a player's inventory, should it be counted towards the spawn conditions?"
                        />

                        <DBItemFormItem
                            colSpan={3}
                            label="Crafted"
                            element={
                                data.elements.find((el) => el.name === "flags")
                                    ?.attributes?.crafted
                            }
                            type="checkbox"
                        />

                        <DBItemFormItem
                            colSpan={3}
                            label="Deloot"
                            element={
                                data.elements.find((el) => el.name === "flags")
                                    ?.attributes?.deloot
                            }
                            type="checkbox"
                        />

                        <GridItem colSpan={6} />

                        <DBItemFormItem
                            colSpan={6}
                            type="select"
                            element={data.elements.filter(
                                (el) => el.name === "category"
                            )}
                            label="Category"
                            description="The category this item belongs to"
                            items={TYPES_CATEGORIES}
                            onChange={(value) =>
                                handleUpdateElement("category", value)
                            }
                        />

                        <DBItemFormItem
                            colSpan={6}
                            type="select"
                            element={data.elements.filter(
                                (el) => el.name === "usage"
                            )}
                            label="Usage"
                            description="The types of locations that this item can spawn"
                            items={TYPES_USAGES}
                            onChange={(value) =>
                                handleUpdateElement("usage", value)
                            }
                        />
                    </Grid>
                </CardBody>
            )}
        </Card>
    );
}

type DBItemFormItemProps = (
    | {
          element?: Element3;
          type: "input";
          onChange?: (value: string) => void;
      }
    | {
          element?: Element3[];
          type: "select";
          items: string[];
          onChange?: (value: string) => void;
      }
    | {
          element?: string;
          type: "checkbox";
          onChange?: (checked: boolean) => void;
      }
) & {
    label: string;
    description?: string;
} & Omit<GridItemProps, "onChange">;

function DBItemFormItem(props: DBItemFormItemProps) {
    const { ...other } = props;

    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        if (!props.onChange) return;

        if (props.type === "checkbox") {
            props.onChange((e.target as HTMLInputElement).checked);
        } else {
            props.onChange(e.target.value);
        }
    };

    if (!props.element) return null;

    if (props.type === "input" && props.element.elements![0].text === "-1")
        return null;

    return (
        <GridItem {...other} onChange={undefined}>
            <Stack>
                <FormControl>
                    {props.type !== "checkbox" && (
                        <FormLabel color="text.light">{props.label}</FormLabel>
                    )}

                    {props.type === "input" && (
                        <Input
                            onChange={handleChange}
                            color="text.light"
                            value={props.element?.elements![0].text}
                        />
                    )}

                    {props.type === "select" && (
                        <Select
                            value=""
                            onChange={handleChange}
                            color="text.light"
                        >
                            {props.items.map((item, itemIndex) => (
                                <option key={itemIndex} value={item}>
                                    {item}
                                </option>
                            ))}
                        </Select>
                    )}

                    {props.type === "checkbox" && (
                        <Checkbox
                            onChange={handleChange}
                            color="text.light"
                            defaultChecked={
                                props.element === "0" ? false : true
                            }
                        >
                            {props.label}
                        </Checkbox>
                    )}

                    {props.description && (
                        <FormHelperText>{props.description}</FormHelperText>
                    )}
                </FormControl>

                {props.type === "select" && (
                    <Stack direction="row" spacing={1.5}>
                        {props.element?.map((el, elIndex) => (
                            <Tag key={elIndex}>{el.attributes?.name}</Tag>
                        ))}
                    </Stack>
                )}
            </Stack>
        </GridItem>
    );
}
