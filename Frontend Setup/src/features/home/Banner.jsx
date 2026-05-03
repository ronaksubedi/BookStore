import BannerImg from "../../assets/banner.png";

export default function Banner() {
  return (
    <section id="home" className="w-full py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
    
        {/* Content — left side */}
        <div className="w-full md:w-1/2">
          <h1 className="text-3xl md:text-5xl font-medium mb-6 leading-tight">
            New Releases This Week
          </h1>
          <p className="text-gray-600 text-base mb-8">
            It's time to update your reading list with some of the latest and
            greatest releases in the literary world. From heart-pumping thrillers
            to captivating memoirs, this week's new releases offer something for
            everyone.
          </p>
          <button className="btn-primary">Subscribe</button>
        </div>

        {/* Image — right side */}
        <div className="w-full md:w-1/2 flex justify-center md:justify-end">
          <img
            src={BannerImg}
            alt="New Releases Banner"
            className="w-full max-w-md object-contain"
          />
        </div>
        

      </div>
    </section>
  );
}