import {NextPage} from "next";
import {Button, Center, FormControl, FormErrorMessage, FormLabel, Input, VStack} from "@chakra-ui/react";
import {useForm, SubmitHandler} from "react-hook-form";


type Inputs = {
    example: string;
    exampleRequired: string;
}

const Form: NextPage = () => {
    const {register, handleSubmit, watch, formState: {errors, isValid, isDirty}} = useForm<Inputs>();
    const onSubmit: SubmitHandler<Inputs> = data => console.log(data);
    return (
        <Center w="md">
            <form onSubmit={handleSubmit(onSubmit)}>
                <VStack spacing="4">
                    <FormControl isInvalid={Boolean(errors.example)}>
                        <FormLabel htmlFor='example'>Example</FormLabel>
                        <Input  {...register('example')}/>
                        <FormErrorMessage>{errors.example && errors.example.message}</FormErrorMessage>
                    </FormControl>
                    <FormControl isInvalid={Boolean(errors.exampleRequired)}>
                        <FormLabel htmlFor='exampleRequired'>Example Required</FormLabel>
                        <Input id="exampleRequired" {...register("exampleRequired", {required: 'Field is required'})} />
                        <FormErrorMessage>{errors.exampleRequired && errors.exampleRequired.message}</FormErrorMessage>
                    </FormControl>
                    <Button colorScheme="teal" w="full" type="submit">
                        Submit
                    </Button>
                </VStack>

            </form>

        </Center>
    );

}
export default Form;
