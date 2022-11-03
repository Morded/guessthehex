type GuideSectionProps = {
  title: string;
  children?: | React.ReactChild | React.ReactChild[];
}

const GuideSection = ({
  title,
  children
}: GuideSectionProps) => {
  return (
    <>
      <h1 className="text-xl font-bold mb-4">{title}</h1>
      {children}
      <div className="m-4"></div>
    </>
  )
}


type ColorExampleProps = {
  colorHex: string;
  colorName: string;
}

const ColorExample = ({
  colorHex,
  colorName
}: ColorExampleProps) => {
  return (
    <div className="flex justify-center items-center">
      <div style={{ background: colorHex }} className="mr-2 w-3 h-3" ></div>
      <p>{colorHex} represents {colorName}</p>
    </div >
  )
}

export { GuideSection, ColorExample };
