import { Button, TextInput } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { WEBSITE_CONFIG } from "../../config";

const Subscribe = () => {
    const matches = useMediaQuery('(max-width: 639px)');
    const matches1 = useMediaQuery('(max-width: 475px)');
    const { subscribe } = WEBSITE_CONFIG.landing;

    return <section data-aos="zoom-out" className="mt-20  flex items-center bg-mine-shaft-900 mx-20 sm-mx:mx-5  py-3 rounded-xl justify-around flex-wrap">
        <h2 className="text-4xl md-mx:text-3xl sm-mx:text-2xl xs-mx:text-xl w-2/5 bs-mx:w-4/5 text-center font-semibold text-mine-shaft-100">
            {subscribe.title.split("Job News?")[0]} <span className="text-bright-sun-400">Job News?</span>
        </h2>
        <div className="flex gap-4 rounded-xl xs-mx:flex-col  bg-mine-shaft-700 px-3 py-2 xs:items-center">
            <TextInput
                className=" [&_input]:text-mine-shaft-100 font-semibold"
                variant="unstyled"
                placeholder={subscribe.placeholder}
                size={matches1?"sm":matches?"md":"xl"}
            />
            <Button className="!rounded-lg" size={matches1?"sm":matches?"md":"xl"} color="brightSun.4" variant="filled">{subscribe.buttonText}</Button>
        </div>
    </section>
}
export default Subscribe;